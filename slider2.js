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
                    $("<li style='left:"+(de.imageindex-1)*de.parentW / de.number+'px'+"'><img style='width:" + width + ";'></li>").appendTo($(a).find(de.items));
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
            var getArrayLength = (de.array.length < de.gundong) ? de.array.length : de.gundong;
            var lastLiImageIndex = parseInt($(a).find(de.items).children('li').last().css('left'))/width+1;
            console.log(lastLiImageIndex);
            de.mf = parseInt($(a).find(de.items).css('margin-left')) - width * (getArrayLength);
            if(!de.savenumber){
                if (-de.mf > width * (de.imageindex - de.number)) {
                    de.mf = -width * (de.imageindex - de.number);
                }
                controls.getArray(a, de);
                controls.createImg(a, de);
            }else{
                if (lastLiImageIndex === de.imageindex) {
                    controls.getArray(a, de);
                    controls.createImg(a, de);
                    de.mf -= width*de.gundong;
                    if (-de.mf > width * (de.imageindex - de.number)) {
                        de.mf = -width * (de.imageindex - de.number);
                    }
                }else{
                    de.mf -= width*de.gundong;
                    de.imageindex += de.gundong;
                }
                // if(lastLiImageIndex-de.savenumber > de.imageindex){
                //     //
                //     console.log(1);
                // }else{

                // }
            }
            $(a).find(de.items).stop().animate({
                    'margin-left': de.mf + 'px'
                },
                de.speed);
            console.log(de.imageindex);
        },
        //往左
        left: function (a, de) {
            var width = de.parentW / de.number;
            de.imageindex -= de.gundong;
            de.imageindex = (de.imageindex < de.number) ? de.number : de.imageindex;
            if (-parseInt($(a).find(de.items).css('margin-left')) < 0) {
                return;
            }
            de.mf = parseInt($(a).find(de.items).css('margin-left')) + width * de.gundong;
            if (de.mf > 0) {
                de.mf = 0;
            }
            if (de.savenumber) {
                if(de.cacheArray.length !== 0){
                    if (de.number+de.savenumber<=de.imageindex){
                        for (var i = 0; i < de.gundong; i++) {
                            $("<li style='left:"+(de.imageindex-de.number-de.savenumber)*de.parentW / de.number+'px'+"'><img style='width:" + width + ";'></li>").prependTo($(a).find(de.items));
                            $(a).find("img")[0].src = de.cacheArray[de.imageindex-de.number-de.savenumber];
                            de.cacheArray[de.imageindex-de.number-de.savenumber] = null;
                        }
                    }
                }
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

            keep.recovery($el, de);
            if (de.autochange) {
                $(window).resize(function () {
                    /* Act on the event */
                    controls.windowsize($el, de);
                });
            }
            controls.addimage($el, de);
            $ul.height('300px');
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
                    de.cacheArray = [];
                    var ulCurrentMl = $(a).find(de.items).css('margin-left');
                    recoveryTime = setInterval(function(){
                    var lastImageIndex = parseInt($(a).find(de.items).children('li').last().css('left'))/(de.parentW / de.number) + 1;
                    //删除前面
                        if(de.savenumber < de.imageindex-de.number){
                            for (var i = 0; i < de.imageindex-de.number-de.savenumber; i++) {
                                // console.log(i);
                                if(!de.cacheArray[i]){
                                    de.cacheArray[i] = $(a).find(de.items).children('li').eq(0).find('img')[0].src;
                                    $(a).find(de.items).children('li').eq(0).remove();
                                }
                                console.log(de.cacheArray);
                            }
                        }
                        //删除后面
                        if (lastImageIndex > de.imageindex + de.savenumber) {
                            for(var j = 0; j < lastImageIndex - (de.imageindex + de.savenumber);j++){
                                console.log(j);
                                de.cacheArray[lastImageIndex - 1] = $(a).find(de.items).children('li').last().find('img')[0].src;
                                $(a).find(de.items).children('li').last().remove();
                                console.log(de.cacheArray);
                            }
                        }
                    },5000);
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
        savenumber: 2, //显示前后保存的数据
        autochange: true, //是否自动适应平铺
        autoplay: false, //自动播放
        arrow: true, //有箭头
        duration: 3000, //自动播放时延迟
        speed: 200, //箭头滚动速度
        autospeed: 'slow', //自动播放速度
        loading: null
    });
});