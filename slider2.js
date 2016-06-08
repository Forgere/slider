(function ($) {
    var controls = {
        //自动适应
        windowsize: function (a, de) {
            de.parentW = Math.floor(parseInt($(a).parent().css('width')) / de.number) * de.number;
            var imgWarp = Math.floor(parseInt($(a).parent().css('width')) / de.number) * de.number + 'px';
            var imgW = Math.floor(parseInt($(a).parent().css('width')) / de.number) + 'px';
            $(a).css('width', imgWarp);
            $(a).find('img').css('width', imgW);
            controls.stop();
            $(a).find(de.items).css('margin-left', (de.number - de.imageindex) * parseInt(imgW));
        },
        //获取数据
        getArray: function (a, de) {
            var width = de.parentW / de.number;
            //初始化图片地址数组
            if (de.imageindex === 0) {
                de.array = romoteArray.slice(de.imageindex, de.imageindex + de.number);
            } else {
                //排布已经取得的图片地址，远程图片取完则不再取
                if (romoteArray[de.imageindex]) {
                    if (de.imageindex + de.gundong > romoteArray.length) {
                        de.array = romoteArray.slice(de.imageindex, romoteArray.length);
                        de.imageindex = romoteArray.length;
                    } else {
                        de.array = romoteArray.slice(de.imageindex, de.imageindex + de.gundong);
                        de.imageindex += de.gundong;
                    }
                } else {
                    de.array = [];
                }
            }
        },
        //初始添加图片
        addimage: function (a, de) {
            //添加初始图片
            var width = de.parentW / de.number + 'px';
            $(a).css({
                'width': width * de.number
            });
            $(a).find(de.items).css({
                'width': width * de.number
            });
            for (var i = 0; i < de.number; i++) {
                $("<li style='left:"+de.imageindex*de.parentW / de.number+'px'+"'><img src=" + de.array[0] + " style='width:" + width + ";'></li>").appendTo($(a).find(de.items));
                de.imageindex ++;
                de.array.shift();
            }
        },
        //创建图片
        createImg: function (a, de) {
            var width = de.parentW / de.number + 'px';
            if (!de.loading) {
                //余下图片小余滚动数值时
                var getArrayLength = (de.array.length < de.gundong) ? de.array.length : de.gundong;
                for (var j = 0; j < getArrayLength; j++) {
                    $("<li><img style='width:" + width + ";'></li>").appendTo($(a).find(de.items));
                    $(a).find("img")[$(a).find("img").length - 1].src = de.array.shift();
                }
            } else {
                lazyload.change(a, de);
            }
        },
        //自动播放
        autoplay: function (a, de) {
            timemachine = setInterval(function () {
                controls.right(a, de);
            }, de.duration);
        },
        //停止
        stop: function () {
            window.clearInterval(timemachine);
        },
        //往右
        right: function (a, de) {
            var width = de.parentW / de.number;
            var parentLeft = $(a).offset().left;
            controls.getArray(a, de);
            var getArrayLength = (de.array.length < de.gundong) ? de.array.length : de.gundong;
            controls.createImg(a, de);
            de.mf = parseInt($(a).find(de.items).css('margin-left')) - width * (getArrayLength);
            if(!de.savenumber){
                if (-de.mf > width * (de.imageindex - de.number)) {
                    de.mf = -width * (de.imageindex - de.number);
                }
            }else{

            }
            $(a).find(de.items).stop().animate({
                    'margin-left': de.mf + 'px'
                },
                de.speed);
            console.log(de.imageindex);
        },
        //往左
        left: function (a, de) {
            de.imageindex -= de.gundong;
            de.imageindex = (de.imageindex < de.number) ? de.number : de.imageindex;
            if (-parseInt($(a).find(de.items).css('margin-left')) < 0) {
                return;
            }
            var width = de.parentW / de.number;
            de.mf = parseInt($(a).find(de.items).css('margin-left')) + width * de.gundong;
            if (de.mf > 0) {
                de.mf = 0;
            }
            $(a).find(de.items).stop().animate({
                'margin-left': de.mf + 'px'
            }, de.speed);
            console.log(de.imageindex);
        }
    };
    var methods = {
        init: function (o) {
            var de = {
                imageindex: 0,
                number: 4,
                gundong: 1,
                savenumber: null,
                items: 'ul',
                item: '>li',
                autoplay: true,
                autochange: true,
                duration: 3000,
                arrow: true,
                speed: 'fast',
                autospeed: 'slow',
                array: [],
                cache: [],
                loading: 'loading.gif'
            };
            de = $.extend({}, de, o);
            controls.getArray($el, de);
            var $el = $(this),
                $ul = $el.find(de.items);
            var parentW = Math.floor(parseInt($el.parent().css('width')) / de.number) * de.number + 'px';
            de.parentW = Math.floor(parseInt($el.parent().css('width')) / de.number) * de.number;
            $el.css({
                overflow: 'hidden',
                width: parentW,
            });

            // keep.recovery($el, de);
            if (de.autochange) {
                $(window).resize(function () {
                    /* Act on the event */
                    controls.windowsize($el, de);
                });
            }
            controls.addimage($el, de);
             console.log($ul.height('300px'));
            if (de.autoplay) {
                controls.autoplay($el, de);
                //hover
                $el.hover(function () {
                    controls.stop();
                });
                // 鼠标移开
                $el.mouseleave(function () {
                    controls.autoplay($el, de);
                });
            }
            if (de.arrow) {
                $('.arrow-right').click(function () {
                    controls.right($el, de);
                });
                $('.arrow-left').click(function () {
                    controls.left($el, de);
                });
            }
        }
    };
    var keep = {
        recovery: function (a, de) {
            if (de.savenumber) {
                var beforeImageIndex = Math.ceil((de.savenumber - de.number) / 2),
                    liCurrentLength = $(a).find(de.items).children('li').length,
                    width = de.parentW / de.number;
                de.cacheArray = [];
                recoveryTime = setInterval(function () {
                    var ulCurrentMl = $(a).find(de.items).css('margin-left');
                    if (de.savenumber < $(a).find(de.items).children('li').length) {
                        for (var i = 0; i < de.savenumber - de.number - beforeImageIndex; i++) {
                            if (de.savenumber >= $(a).find(de.items).children('li').length) {
                                return;
                            }
                            console.log($(a).find(de.items).children('li').eq(i).find('img')[0].src);
                            de.cacheArray.push($(a).find(de.items).children('li').eq(i).find('img')[0].src);
                            console.log(de.cacheArray);
                            $(a).find(de.items).children('li').eq(i).remove();
                            $(a).find(de.items).css('margin-left', parseInt(ulCurrentMl)+width+'px');
                            // if (de.savenumber >= $(a).find(de.items).children('li').length) {
                            //     return;
                            // }
                            // $(a).find(de.items).children('li').eq(liCurrentLength - i).remove();
                        }
                    }
                }, 5000);
            }
        }
    };
    var lazyload = {
        change: function (a, de) {
            var width = de.parentW / de.number;
        }
    };
    $.fn.silder = function (method) {
        // 方法调用
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            methods.init.apply(this, arguments);
        } else {
            $.error('Method' + method + 'does not exist on jQuery.silder');
        }
    };
})(jQuery);
//调用init方法
$(function () {
    romoteArray = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '1.jpg', '2.jpg', '3.jpg'];
    $('.slider').silder({
        number: 3, //图数量
        gundong: 1, //滚动数量
        savenumber: 6, //保存数量为number整数倍
        autochange: true, //是否自动适应平铺
        autoplay: false, //自动播放
        arrow: true, //有箭头
        duration: 3000, //自动播放时延迟
        speed: 200, //箭头滚动速度
        autospeed: 'slow', //自动播放速度
        loading: null
    });
});