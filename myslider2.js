(function ($) {
    var Slider = function () {
        //  默认参数
        this.o = {
            imageindex: 0,
            number: 4,
            gundong: 1,
            savenumber: null,
            items: '>ul',
            item: '>li',
            autoplay: false,
            loop: false,
            autochange: false,
            duration: 3000,
            arrows: true,
            prev: '&larr;',
            next: '&rarr;',
            speed: 200,
            autospeed: 'slow',
            array: [],
            cache: [],
            easing: 'swing',
            lazyload: true,
            loading: '',
            fadeIn: false,
            romoteArray:'',
            ajaxcallback:false
        };

        this.init = function (el, o) {
            //  信息合并
            this.o = $.extend(this.o, o);
            this.el = el;
            this.ul = el.find(this.o.items);
            this.li = this.ul.find(this.o.item);
            this.parentW = Math.floor(parseInt(el.parent().css('width')) / this.o.number) * this.o.number;
            this.liWidth = this.parentW / this.o.number;
            //  当前图片index
            this.i = 0;
            //已加载图片的最大index
            this.maxI = this.o.number;
            //初始加赞图片
            this.o.array = romoteArray.slice(this.i, this.i + this.o.number);
            if (this.o.lazyload) {
                for (var i = 0; i < this.o.number; i++) {
                    this.addImage(this.o.array,'right',this.i);
                    this.i++;
                }
            } else {
                for (var j = 0; j < this.o.number; j++) {
                    $("<li style='left:" + this.i * this.parentW / this.o.number + 'px' + "'><img src=" + this.o.array[0] + " style='width:" + this.liWidth + ";'></li>").appendTo(this.ul);
                    this.i++;
                    //清空数组
                    this.o.array.shift();
                }
            }
            //高度
            this.ul.height('100%');
            //  Autoslide
            this.o.autoplay && setTimeout(function () {
                if (this.o.duration | 0) {
                    if (this.o.autoplay) {
                        this.play();
                    }
                    this.el.on('mouseover mouseout', function (e) {
                        this.stop();
                        this.o.autoplay && e.type == 'mouseout' && this.play();
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
                    var sliderWidth = this.liWidth * this.o.number;
                    this.r && clearTimeout(this.r) && clearTimeout(this.protectTime);
                    this.r = setTimeout(function () {
                        var beforeSaveLiList = this.el.find(this.o.items).children('li');
                        var beforeSaveWidth = parseInt(this.el.find(this.o.items).children('li').eq(0).outerWidth());
                        this.el.width(sliderWidth);
                        this.el.find('img').width(sliderWidth / this.o.number);
                        var liWidth = beforeSaveLiList.eq(0).outerWidth();
                        for (var i = 0; i < beforeSaveLiList.length; i++) {
                            if(this.i === this.maxI){
                                beforeSaveLiList.eq(i).css('left', liWidth * (this.i - beforeSaveLiList.length + i));
                            }else if(this.maxI-this.o.savenumber > this.i){
                                beforeSaveLiList.eq(i).css('left', liWidth * (parseInt(beforeSaveLiList.eq( beforeSaveLiList.length - 1).css('left'))/this.liWidth + 1 - beforeSaveLiList.length + i ));
                            }else if(this.o.savenumber > this.maxI - this.i){
                                beforeSaveLiList.eq(i).css('left', liWidth * (this.maxI - beforeSaveLiList.length + i));
                            }
                        }
                        this.el.find(this.o.items).css('left', (this.o.number - this.i) * liWidth);
                    }, 50);
                }).resize();
            }
            setInterval(
                function(){
                    this.protect();
                },1000);
            return this;
        };
        this.getArray = function(from, to) {
            if (to <= this.maxI) {
                if (this.o.cache[from] == null || undefined) {
                    this.o.array = [];
                } else {
                    this.o.array[0] = this.o.cache[from];
                }
            } else {
                this.o.array = this.o.romoteArray.slice(from, to);
            }
            return this.o.array;
        },
        this.addImage = function (array, direction, index) {
            if (array.length === 0) {
                return;
            }
            //lazyload support
            if (this.o.lazyload) {
                lazyload(array, direction, index);
            } else {
                // if (array[0] === '' || !array[0]) {array.shift();}
                $("<li style='left:" + (this.i - 1) * this.liWidth + 'px' + "'><img src=" + array[0] + " style='width:" + this.liWidth + ";'></li>").appendTo(this.ul);
                array.shift();
            }
        },
        this.lazyloadfunction = function(array, direction, index) {
            var creatImg = $("<li style='left:" + index * this.liWidth + 'px' + "'><img src=" + this.o.loading + " style='height:100%;width:" + this.liWidth + ";'></li>");
            if (direction === 'left') {
                creatImg = $("<li style='left:" + (index - this.o.number - 1) * this.liWidth + 'px' + "'><img src=" + this.o.loading + " style='width:" + this.liWidth + ";'></li>");
                creatImg.prependTo(this.ul);
            } else {
                creatImg.appendTo(this.ul);
            }
            var tmpimg = $("<img src=" + array[0] + ">");
            tmpimg.ready(function () {
                setTimeout(function () {
                    //fadeIn
                    if (this.o.fadeIn) {
                        creatImg.find('img').attr('src', tmpimg.attr('src')).hide().fadeIn('slow');
                    } else {
                        creatImg.find('img').attr('src', tmpimg.attr('src'));
                    }
                }, 1000);
            });
            array.shift();
        },
        this.protect = function(){
            if(this.o.savenumber){
                this.protectTime = setTimeout(
                    function(){
                    this.protectMemory();
                    }
                    ,100);
            }
        };
        //  根据this.i移动ul
        this.to = function (index, callback) {
            if (this.t) {
                this.stop();
                this.play();
            }
            var o = this.o,
                el = this.el,
                ul = this.ul,
                li = this.li,
                current = this.i,
                target = romoteArray[index];
            //  slider到达边缘条件
            if ((romoteArray.length + 1 === this.i) && o.loop === false) {
                this.i = index;
                return;
            }
            if (index < this.o.number && o.loop === false) {
                this.i = this.o.number;
                return;
            }

            var speed = callback ? 5 : o.speed | 0,
                easing = o.easing,
                obj = {};

            if (!ul.queue('fx').length) {
                el.animate(obj, speed, easing) && ul.animate($.extend({
                    left: (this.o.number - index) * Math.floor(parseInt(el.parent().css('width')) / this.o.number) * this.o.number / this.o.number
                }, obj), speed, easing, function (data) {
                    this.maxI = (index > this.maxI) ? index : this.maxI;
                });
            }
        };

        //  自动增加index
        this.play = function () {
            this.t = setInterval(function () {
                this.to(this.i + 1);
            }, this.o.duration | 0);
        };

        //  Stop
        this.stop = function () {
            this.t = clearInterval(this.t);
            return this;
        };

        //  右箭头
        this.next = function () {
            if (romoteArray.length === this.i) return;
            this.i ++;
            this.getArray(this.i - 1, this.i);
            //判断要添加的图片是否不存在
            var lastImageLeft = parseInt(this.el.find(this.o.items).children('li').last().css('left'));
            var width = Math.floor(parseInt(this.el.parent().css('width')) / this.o.number);
            var lastImageIndex = lastImageLeft/width - 1;
            if(this.i > lastImageIndex){
                this.addImage(this.o.array,'right',this.i-1);
            }
            return this.stop().to(this.i);
        };
        //  左箭头
        this.prev = function () {
        	this.i --;
            if (this.o.number === this.i+1) return;
            if(this.o.savenumber){
                var firstImageLeft = parseInt(this.el.find(this.o.items).children('li').first().css('left'));
                var width = Math.floor(parseInt(this.el.parent().css('width')) / this.o.number);
                var firstImageIndex = firstImageLeft/width ;
                this.getArray(this.i-this.o.number, this.i-this.o.number+1);
                //判断要添加的图片是否不存在
                if(this.i-this.o.number < firstImageIndex){
                    this.addImage(this.o.array,'left',this.i+1);
                }
            }
            return this.stop().to(this.i);
        };
        //  Create dots and arrows
        function nav(name, html) {
            if (name == 'dot') {
                html = '<ol class="dots">';
                $.each(this.li, function (index) {
                    html += '<li class="' + (index == this.i ? name + ' active' : name) + '">' + ++index + '</li>';
                });
                html += '</ol>';
            } else {
                html = '<div class="';
                html = html + name + 's">' + html + name + ' prev">' + this.o.prev + '</div>' + html + name + ' next">' + this.o.next + '</div></div>';
            }

            this.el.addClass('has-' + name + 's').append(html).find('.' + name).click(function () {
                var me = $(this);
                me.hasClass('dot') ? this.stop().to(me.index()) : me.hasClass('prev') ? this.prev() : this.next();
            });
        }
        //保护内存
        this.protectMemory = function(){
            //留下的图片的index 从0开始
            var protectededFirst = this.i - (this.o.number + this.o.savenumber);
            var protectededLast = this.i + this.o.savenumber - 1;
            //限制修正这两个index
            protectededFirst = (protectededFirst < 0) ? 0 : protectededFirst;
            protectededLast = (protectededLast > this.maxI) ? this.maxI : protectededLast;
            var currentLiList = this.el.find(this.o.items).children('li');
            var liEachWidth = Math.floor(parseInt(this.el.parent().css('width')) / this.o.number) * this.o.number / this.o.number;
            //删除其他图片
            for (var i = 0; i < currentLiList.length; i++) {
                var liEachLeft = parseInt(currentLiList.eq(i).css('left'));
                var eachImageIndex = liEachLeft / liEachWidth;
                if(eachImageIndex < protectededFirst || eachImageIndex > protectededLast){
                    //保存数据
                    this.o.cache[eachImageIndex] = currentLiList.eq(i).find('img').attr('src');
                    currentLiList.eq(i).remove();
                }
            }
        };
    };

    //  Create a jQuery plugin
    $.fn.slider2 = function (o) {
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