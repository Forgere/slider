(function ($) {
    var controls = {
        windowsize : function(a,de){
            var imgWarp = Math.floor(parseInt($(a).parent().css('width'))/de.number)*de.number+'px';
            var imgW = Math.floor(parseInt($(a).parent().css('width'))/de.number)+'px';
            $(a).css('width', imgWarp);
            $(a).find('img').css('width', imgW);
        },
        addimage : function(a,de){
            //添加初始图片
            var width = Math.floor($(a).width()/de.number)+'px';
            $(a).css({'width':width*de.number});
            for (var j = 0; j < de.number; j++) {
                $("<li><img src="+de.array[0]+" style='width:"+width+";'></li>").appendTo($(a).find(de.items));
                de.array.shift();
            }
        },
        autoplay : function(a,de){
            var mf=parseInt($(a).find(de.items).css('margin-left'));
            timemachine=setInterval(function(){
                controls.createImg(a,de);
                var alen = $(a).find(de.items).children('li').length-de.number;
                var width = Math.floor(parseInt($(a).parent().width())/de.number);
                //滚动限制
                if(mf==(-alen)*width){
                    mf = 0;
                }else{
                    mf = parseInt($(a).find(de.items).css('margin-left')) -width*de.gundong;
                    if(-mf>(alen)*width){
                        mf=(-alen)*width;
                    }
                }
                $(a).find(de.items).stop().animate({
                        'margin-left': mf +'px'
                    },
                    de.autospeed);
                },de.duration
            );
        },
        createImg : function(a,de){
            var width = Math.floor(parseInt($(a).parent().css('width'))/de.number);
            for (var j = 0; j < de.gundong; j++) {
                if(de.array.length===0){return;}
                $("<li><img style='width:"+width+";'></li>").appendTo($(a).find(de.items));
                $(a).find("img")[$(a).find("img").length-1].src = de.array.shift();
            }
        },
        stop : function(){
            window.clearInterval(timemachine);
        },
        right : function(a,de){
            var mf=parseInt($(a).find(de.items).css('margin-left'));
            var width = Math.floor(parseInt($(a).parent().width())/de.number);
            controls.createImg(a,de);
            var alen = $(a).find(de.items).children('li').length-de.number;
            if(mf==(-alen)*width){
                mf = 0;
            }else{
                mf = parseInt($(a).find(de.items).css('margin-left')) -width*de.gundong;
                if(-mf>(alen)*width){
                    mf=(-alen)*width;
                }
            }
            $(a).find(de.items).stop().animate({
                    'margin-left': mf +'px'
                },
                de.speed);
        },
        left : function(a,de){
            if(-parseInt($(a).find(de.items).css('margin-left')) < 0){
                return;
            }
            var width = Math.floor(parseInt($(a).parent().width())/de.number);
            mf = parseInt($(a).find(de.items).css('margin-left')) +width*de.gundong;
            if(mf>0){ mf = 0;}
            $(a).find(de.items).stop().animate({
                    'margin-left':mf +'px'
            },de.speed);
        },
    };
    var methods = {
        init: function (o) {
            var de = {
                number : 4,
                gundong : 1,
                items : 'ul',
                item : '>li',
                autoplay: true,
                autochange:true,
                duration:3000,
                arrow:true,
                speed:'fast',
                autospeed:'slow',
                array : ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg']
            };
            de = $.extend({},de, o);
            var $el= $(this),
                $ul= $el.find(de.items);
            var parentW =  Math.floor(parseInt($el.parent().css('width'))/de.number)*de.number+'px';
            $el.css({
                overflow: 'hidden',
                width : parentW,
            });
            if(de.autochange){
                $(window).resize(function() {
                    /* Act on the event */
                    controls.windowsize($el, de );
                });
            }
            controls.addimage($el, de );
            if(de.autoplay){
                controls.autoplay($el,de);
                //hover
                $el.hover(function() {
                    controls.stop();
                });
                // 鼠标移开
                $el.mouseleave(function(){
                    controls.autoplay($el,de);
                });
            }
            if(de.arrow){
                $('.arrow-right').click(function(){
                    controls.right($el, de );
                });
                $('.arrow-left').click(function(){
                    controls.left($el, de );
                });
            }
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
$(function(){
    $('.slider').silder({
        number : 1,         //图数量
        gundong:1,          //滚动数量
        autochange:true,    //是否自动适应平铺
        autoplay:true,      //自动播放
        arrow:true,         //有箭头
        duration:3000,      //自动播放时延迟
        speed:200,          //箭头滚动速度
        autospeed:'slow',   //自动播放速度
        //图片url数组
        array:['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg']});
});













