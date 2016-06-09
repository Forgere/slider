(function($) {
    var Slider = function() {
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
            loop : false,
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
            loading: 'loading.gif'
        };

        _.init = function(el, o) {
            //  信息合并
            _.o = $.extend(_.o, o);

            _.el = el;
            _.ul = el.find(_.o.items);
            _.li = _.ul.find(_.o.item);
            _.parentW = Math.floor(parseInt(el.parent().css('width')) / _.o.number) * _.o.number;
            _.liWidth = _.parentW / _.o.number;
            console.log(_.parentW);
            //  当前图片index
            _.i = 0;

            //初始加赞图片
            _.o.array = romoteArray.slice(_.i, _.i + _.o.number);
            for (var i = 0; i < _.o.number; i++) {
                $("<li style='left:" + _.i * _.parentW / _.o.number + 'px' + "'><img src=" + _.o.array[0] + " style='width:" + _.liWidth + ";'></li>").appendTo(_.ul);
                _.i++;
                //清空数组
                _.o.array.shift();
            }
            //高度
            _.ul.height('100%');
            //  Autoslide
            _.o.autoplay && setTimeout(function() {
                if (_.o.duration | 0) {
                    if(_.o.autoplay){
                        _.play();
                    }
                    _.el.on('mouseover mouseout', function(e) {
                        _.stop();
                        _.o.autoplay && e.type == 'mouseout' && _.play();
                    });
                }
            }, 0);
            //  Dot pagination
            o.dots && nav('dot');

            //  Arrows support
            if(o.arrows){
                nav('arrow');
            }
            //  Patch for fluid-width sliders. Screw those guys.
            if (o.fluid) {
                $(window).resize(function() {
                    _.r && clearTimeout(_.r);

                    _.r = setTimeout(function() {
                        var styl = {},
                        // var styl = {height: li.eq(_.i).outerHeight()},
                        width = el.width();
                        ul.css(styl);
                        styl['width'] = Math.min(Math.round((width / el.parent().width()) * 100), 100) + '%';
                        el.css(styl);
                        li.css({ width: el[0].getBoundingClientRect().width });
                    }, 50);
                }).resize();
            };
            return _;
        };

        //  根据_.i移动ul
        _.to = function(index, callback) {
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
                console.log(_.i);
            //  slider到达边缘条件
            if ((romoteArray.length+1 === _.i) && o.loop === false) {
                _.i = index;
                return;
            }
            if (index < _.o.number && o.loop === false) {
                _.i = _.o.number;
                return;}

            //  无线循环
            // if (romoteArray.length === _.i) index = 0;
            // if (index < 0) index = romoteArray.length - 1;
            // target = li.eq(index);

            var speed = callback ? 5 : o.speed | 0,
                easing = o.easing,
                obj = {};
                // obj = {height: target.outerHeight()};

            if (!ul.queue('fx').length) {
                //  Handle those pesky dots
                // el.find('.dot').eq(index).addClass('active').siblings().removeClass('active');

                el.animate(obj, speed, easing) && ul.animate($.extend({left: (_.o.number-index)*_.liWidth}, obj), speed, easing, function(data) {
                    _.i = index;
                    console.log(_.i);
                });
            }
        };

        //  自动增加index
        _.play = function() {
            _.t = setInterval(function() {
                _.to(_.i + 1);
            }, _.o.duration | 0);
        };

        //  Stop
        _.stop = function() {
            _.t = clearInterval(_.t);
            return _;
        };

        //  右箭头
        _.next = function() {
            if ( romoteArray.length === _.i) return;
            _.getArray(_.i,_.i + 1);
            _.addImage(_.o.array);
            return _.stop().to(_.i + 1);
        };
        //  左箭头
        _.prev = function() {
            if ( _.o.number === _.i) return;
            return _.stop().to(_.i - 1);
        };
        //获取数据
        _.getArray = function(from,to){
            _.o.array = romoteArray.slice(from, to);
            return _.o.array;
        };
        //加入图片
        _.addImage = function(array){
            $("<li style='left:" + _.i * _.parentW / _.o.number + 'px' + "'><img src=" + array[0] + " style='width:" + _.liWidth + ";'></li>").appendTo(_.ul);
            array.shift();
        };
        //  Create dots and arrows
        function nav(name, html) {
                console.log(name);
            if (name == 'dot') {
                html = '<ol class="dots">';
                    $.each(_.li, function(index) {
                        html += '<li class="' + (index == _.i ? name + ' active' : name) + '">' + ++index + '</li>';
                    });
                html += '</ol>';
            } else {
                html = '<div class="';
                html = html + name + 's">' + html + name + ' prev">' + _.o.prev + '</div>' + html + name + ' next">' + _.o.next + '</div></div>';
            }

            _.el.addClass('has-' + name + 's').append(html).find('.' + name).click(function() {
                var me = $(this);
                me.hasClass('dot') ? _.stop().to(me.index()) : me.hasClass('prev') ? _.prev() : _.next();
            });
        }
    };

    //  Create a jQuery plugin
    $.fn.silder = function(o) {
        var len = this.length;

        //  Enable multiple-slider support
        return this.each(function(index) {
            //  Cache a copy of $(this), so it
            var me = $(this),
                key = 'unslider' + (len > 1 ? '-' + ++index : ''),
                instance = (new Slider).init(me, o);

            //  Invoke an Unslider instance
            me.data(key, instance).data('key', key);
        });
    };

})(jQuery);
$(function () {
    romoteArray = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '1.jpg', '2.jpg', '3.jpg'];
    $('.slider').silder({
        number: 1, //图数量
        savenumber: 3, //显示前后保存的数据
        autochange: true, //是否自动适应平铺
        autoplay: false, //自动播放
        arrows: true, //有箭头
        duration: 3000, //自动播放时延迟
        speed: 200, //箭头滚动速度
        autospeed: 'slow', //自动播放速度
        loading: null
    });
});