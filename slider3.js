(function ($) {
    var Slider = function () {
        //  保存对象
        var _ = this;

        //  默认参数
        _.o = {
            imageindex: 0,
            number: 4,
            gundong: 1,
            savenumber: null,
            items: '>ul',
            item: '>li',
            autoplay: true,
            loop: false,
            autochange: true,
            duration: 3000,
            arrows: true,
            prev: '&larr;',
            next: '&rarr;',
            speed: 500,
            autospeed: 'slow',
            array: [],
            cache: [],
            easing: 'swing',
            lazyload: true,
            loading: 'loading.gif',
            fadeIn: false
        };

        _.init = function (el, o) {
            //  信息合并
            _.o = $.extend(_.o, o);
            _.el = el;
            _.ul = el.find(_.o.items);
            _.li = _.ul.find(_.o.item);
            _.parentW = Math.floor(parseInt(el.parent().css('width')) / _.o.number) * _.o.number;
            _.liWidth = _.parentW / _.o.number;
            //  当前图片index
            _.i = 0;
            //已加载图片的最大index
            _.maxI = _.o.number;
            //初始加赞图片
            _.o.array = romoteArray.slice(_.i, _.i + _.o.number);
            if (_.o.lazyload) {
                for (var i = 0; i < _.o.number; i++) {
                    _.addImage(_.o.array,'right',_.i);
                    _.i++;
                }
            } else {
                for (var j = 0; j < _.o.number; j++) {
                    $("<li style='left:" + _.i * _.parentW / _.o.number + 'px' + "'><img src=" + _.o.array[0] + " style='width:" + _.liWidth + ";'></li>").appendTo(_.ul);
                    _.i++;
                    //清空数组
                    _.o.array.shift();
                }
            }
            //高度
            _.ul.height('100%');
            //  Autoslide
            _.o.autoplay && setTimeout(function () {
                if (_.o.duration | 0) {
                    if (_.o.autoplay) {
                        _.play();
                    }
                    _.el.on('mouseover mouseout', function (e) {
                        _.stop();
                        _.o.autoplay && e.type == 'mouseout' && _.play();
                    });
                }
            }, 0);
            //  Dot pagination
            o.dots && nav('dot');

            //  Arrows support
            if (o.arrows) {
                nav('arrow');
            }
            //  Patch for fluid-width sliders. Screw those guys.
            if (o.autochange) {
                $(window).resize(function () {
                    var sliderWidth = Math.floor(parseInt(el.parent().css('width')) / _.o.number) * _.o.number;
                    _.r && clearTimeout(_.r);
                    _.r = setTimeout(function () {
                        var beforeSaveLiList = el.find(_.o.items).children('li');
                        var beforeSaveWidth = parseInt(el.find(_.o.items).children('li').eq(0).width());
                        el.width(sliderWidth);
                        el.find('img').width(sliderWidth / _.o.number);
                        var liWidth = beforeSaveLiList.eq(0).width();
                        for (var i = 0; i < beforeSaveLiList.length; i++) {
                            var beforeIndex = Math.floor(parseInt(beforeSaveLiList.eq(i).css('left'))/beforeSaveWidth);
                            beforeSaveLiList.eq(beforeIndex).css('left', liWidth * beforeIndex);
                        }
                        el.find(_.o.items).css('left', (_.o.number - _.i) * liWidth);
                    }, 50);
                }).resize();
            }
            _.el.hover(function() {
                /* Stuff to do when the mouse enters the element */
                clearInterval(_.protectTime);
            },function(){
                _.protect();
            });
            return _;
        };
        _.protect = function(){
            if(_.o.savenumber){
                _.protectTime = setTimeout(
                    function(){
                    _.protectMemory();
                    }
                    ,100);
            }
        };
        //  根据_.i移动ul
        _.to = function (index, callback) {
            if (_.t) {
                _.stop();
                _.play();
            }
            var o = _.o,
                el = _.el,
                ul = _.ul,
                li = _.li,
                current = _.i,
                target = romoteArray[index];
            //  slider到达边缘条件
            if ((romoteArray.length + 1 === _.i) && o.loop === false) {
                _.i = index;
                return;
            }
            if (index < _.o.number && o.loop === false) {
                _.i = _.o.number;
                return;
            }

            var speed = callback ? 5 : o.speed | 0,
                easing = o.easing,
                obj = {};

            if (!ul.queue('fx').length) {
                el.animate(obj, speed, easing) && ul.animate($.extend({
                    left: (_.o.number - index) * Math.floor(parseInt(el.parent().css('width')) / _.o.number) * _.o.number / _.o.number
                }, obj), speed, easing, function (data) {
                    _.maxI = (index > _.maxI) ? index : _.maxI;
                });
            }
        };

        //  自动增加index
        _.play = function () {
            _.t = setInterval(function () {
                _.to(_.i + 1);
            }, _.o.duration | 0);
        };

        //  Stop
        _.stop = function () {
            _.t = clearInterval(_.t);
            return _;
        };

        //  右箭头
        _.next = function () {
            if (romoteArray.length === _.i) return;
            _.i ++;
            _.getArray(_.i - 1, _.i);
            //判断要添加的图片是否不存在
            var lastImageLeft = parseInt(_.el.find(_.o.items).children('li').last().css('left'));
            var width = Math.floor(parseInt(_.el.parent().css('width')) / _.o.number);
            var lastImageIndex = lastImageLeft/width - 1;
            if(_.i > lastImageIndex){
                _.addImage(_.o.array,'right',_.i-1);
            }
            return _.stop().to(_.i);
        };
        //  左箭头
        _.prev = function () {
        	_.i --;
            if (_.o.number === _.i+1) return;
            if(_.o.savenumber){
                var firstImageLeft = parseInt(_.el.find(_.o.items).children('li').first().css('left'));
                var width = Math.floor(parseInt(_.el.parent().css('width')) / _.o.number);
                var firstImageIndex = firstImageLeft/width ;
                _.getArray(_.i-_.o.number, _.i-_.o.number+1);
                //判断要添加的图片是否不存在
                if(_.i-_.o.number < firstImageIndex){
                    _.addImage(_.o.array,'left',_.i+1);
                }
            }
            return _.stop().to(_.i);
        };
        //获取数据
        _.getArray = function (from, to) {
            if (to <= _.maxI) {
                if(_.o.cache[from] == null || undefined){
                    _.o.array = [];
                }else{
                    _.o.array[0] = _.o.cache[from];
                }
            } else {
                _.o.array = romoteArray.slice(from, to);
            }
            return _.o.array;
        };
        //加入图片
        _.addImage = function (array,direction,index) {
            if (array.length === 0) {
                return;
            }
            //lazyload support
            if (_.o.lazyload) {
                _.lazyload(array,direction,index);
            } else {
                // if (array[0] === '' || !array[0]) {array.shift();}
                $("<li style='left:" + (_.i-1) * Math.floor(parseInt(_.el.parent().css('width')) / _.o.number) + 'px' + "'><img src=" + array[0] + " style='width:" + Math.floor(parseInt(_.el.parent().css('width')) / _.o.number) + ";'></li>").appendTo(_.ul);
                array.shift();
            }
        };
        //  Create dots and arrows
        function nav(name, html) {
            if (name == 'dot') {
                html = '<ol class="dots">';
                $.each(_.li, function (index) {
                    html += '<li class="' + (index == _.i ? name + ' active' : name) + '">' + ++index + '</li>';
                });
                html += '</ol>';
            } else {
                html = '<div class="';
                html = html + name + 's">' + html + name + ' prev">' + _.o.prev + '</div>' + html + name + ' next">' + _.o.next + '</div></div>';
            }

            _.el.addClass('has-' + name + 's').append(html).find('.' + name).click(function () {
                var me = $(this);
                me.hasClass('dot') ? _.stop().to(me.index()) : me.hasClass('prev') ? _.prev() : _.next();
            });
        }
        //lazyload
        _.lazyload = function (array,direction,index) {
        	console.log(_.i);
            var creatImg = $("<li style='left:" + index * Math.floor(parseInt(_.el.parent().css('width')) / _.o.number) + 'px' + "'><img src=" + _.o.loading + " style='width:" + Math.floor(parseInt(_.el.parent().css('width')) / _.o.number) + ";'></li>");
            if(direction === 'left'){
                creatImg = $("<li style='left:" + (index-_.o.number-1) * Math.floor(parseInt(_.el.parent().css('width')) / _.o.number) + 'px' + "'><img src=" + _.o.loading + " style='width:" + Math.floor(parseInt(_.el.parent().css('width')) / _.o.number) + ";'></li>");
                creatImg.prependTo(_.ul);
            }else{
                creatImg.appendTo(_.ul);
            }
            var tmpimg = $("<img src=" + array[0] + ">");
            tmpimg.ready(function () {
                setTimeout(function () {
                    //fadeIn
                    if (_.o.fadeIn) {
                        creatImg.find('img').attr('src', tmpimg.attr('src')).hide().fadeIn('slow');
                    } else {
                        creatImg.find('img').attr('src', tmpimg.attr('src'));
                    }
                }, 1000);
            });
            array.shift();
        };
        //保护内存
        _.protectMemory = function(){
            //留下的图片的index 从0开始
            var protectededFirst = _.i - (_.o.number + _.o.savenumber);
            var protectededLast = _.i + _.o.savenumber - 1;
            //限制修正这两个index
            protectededFirst = (protectededFirst < 0) ? 0 : protectededFirst;
            protectededLast = (protectededLast > _.maxI) ? _.maxI : protectededLast;
            var currentLiList = _.el.find(_.o.items).children('li');
            var liEachWidth = Math.floor(parseInt(_.el.parent().css('width')) / _.o.number) * _.o.number / _.o.number;
            //删除其他图片
            for (var i = 0; i < currentLiList.length; i++) {
                var liEachLeft = parseInt(currentLiList.eq(i).css('left'));
                var eachImageIndex = liEachLeft / liEachWidth;
                if(eachImageIndex < protectededFirst || eachImageIndex > protectededLast){
                    //保存数据
                    _.o.cache[eachImageIndex] = currentLiList.eq(i).find('img').attr('src');
                    currentLiList.eq(i).remove();
                }
            }
        };
    };

    //  Create a jQuery plugin
    $.fn.silder = function (o) {
        var len = this.length;

        //  Enable multiple-slider support
        return this.each(function (index) {
            //  Cache a copy of $(this), so it
            var me = $(this),
                // key = 'unslider' + (len > 1 ? '-' + ++index : ''),
                instance = (new Slider).init(me, o);

            //  Invoke an Unslider instance
            // me.data(key, instance).data('key', key);
        });
    };

})(jQuery);
$(function () {
    romoteArray = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
    $('.slider').silder({
        number: 3, //图数量
        savenumber: 3, //显示前后保存的数据
        autochange: true, //是否自动适应平铺
        autoplay: false, //自动播放
        arrows: true, //有箭头
        duration: 3000, //自动播放时延迟
        speed: 200, //箭头滚动速度
        autospeed: 'slow', //自动播放速度
        lazyload: true, //是否开启lazyload
        loading: 'loading.gif', //加载中的图片
        fadeIn: true //开启fadeIn滚动特效
    });


});