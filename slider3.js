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
            $(a).find(de.items).css({'width':width*de.number});
            console.log(de.array);
            for (var j = 0; j < de.savenumber; j++) {
                $("<li><img src="+de.array[0]+" style='width:"+width+";'></li>").appendTo($(a).find(de.items));
                de.array.shift();
            }
        },
        autoplay : function(a,de){
            var mf=parseInt($(a).find(de.items).css('margin-left'));
            timemachine=setInterval(function(){
                controls.getArray(a,de);
                controls.createImg(a,de);
                var alen = $(a).find(de.items).children('li').length-de.number;
                var width = Math.floor(parseInt($(a).parent().width())/de.number);
                //滚动限制
                if(mf==(-alen)*width){
                    if (!de.savenumber){
                        mf = 0;
                    }
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
            //访问到最后一个退出
            if(romoteArray.length===de.indx){
                return;
            }
            var width = Math.floor(parseInt($(a).parent().width())/de.number);
            var alen = $(a).find(de.items).children('li').length-de.number;
            de.beign = 0;
            //图片最右边靠最右边
            if ($(a).find(de.items).css('margin-left')===(de.number-de.savenumber)*width+'px') {
                 de.begin = 1;
            }
            if (de.begin===1) {
                $(a).find(de.items).css('margin-left', (de.number-de.savenumber+1)*width);
                controls.getArray(a,de);
                controls.createImg(a,de);
            }
            mf = parseInt($(a).find(de.items).css('margin-left')) -width*de.gundong;
            console.log(de.indx);
            $(a).find(de.items).stop().animate({
                    'margin-left': mf +'px'
                },
                de.speed);
        },
        left : function(a,de){
            controls.leftadd(a,de);
            if(-parseInt($(a).find(de.items).css('margin-left')) < 0){
                return;
            }
            var width = Math.floor(parseInt($(a).parent().width())/de.number);
            mf = parseInt($(a).find(de.items).css('margin-left')) +width*de.gundong;
            if(mf>0){
                mf = 0;
            }
            $(a).find(de.items).stop().animate({
                    'margin-left':mf +'px'
            },de.speed);
        },
        getArray: function(a,de){
            var width = Math.floor(parseInt($(a).parent().css('width'))/de.number);
            //初始化图片地址数组
            if(de.indx === 0 ){
                de.array=romoteArray.slice(de.indx, de.indx + de.savenumber);
                de.indx += de.savenumber;
            }else{
                //排布已经取得的图片地址，远程图片取完则不再取
                if (romoteArray[de.indx]) {
                    de.array = romoteArray.slice(de.indx,de.indx+de.gundong);
                    de.indx += de.gundong;
                    controls.deleteImg(a,de);
                }
            }
        },
        deleteImg:function(a,de){
            var liarray = $(a).find(de.items).find(de.item);
            var lilength = $(a).find(de.items).find(de.item).length;
            var width = Math.floor(parseInt($(a).parent().css('width'))/de.number);
            // if(lilength===de.savenumber){
                for (var i = 0; i < de.gundong; i++) {
                    de.cache.push(liarray.eq(i).find('img')[0].src);
                    liarray.eq(i).remove();
                }
            // }
        },
        leftadd:function(a,de){
            var liarray = $(a).find(de.items).find(de.item);
            var width = Math.floor(parseInt($(a).parent().css('width'))/de.number);
            if(de.savenumber){
                if(de.cache.length!==0){
                    if (parseInt($(a).find(de.items).css('margin-left'))===0) {
                        $(a).find(de.items).css('margin-left',-de.gundong*width+'px');
                        for (var i = 0; i < de.gundong; i++) {
                            $("<li><img style='width:"+width+";'></li>").prependTo($(a).find(de.items));
                            $(a).find("img")[0].src = de.cache.pop();
                            $(a).find(de.items).find(de.item).eq($(a).find(de.items).find(de.item).length-1).remove();
                            // de.indx -= de.gundong ;
                        }
                    }
                }
            }
        }
    };
    var methods = {
        init: function (o) {
            var de = {
                indx: 0,
                number : 4,
                gundong : 1,
                savenumber: null,
                items : 'ul',
                item : '>li',
                autoplay: true,
                autochange:true,
                duration:3000,
                arrow:true,
                speed:'fast',
                autospeed:'slow',
                array : [],
                cache:[],
            };
            de = $.extend({},de, o);
            if (de.array.length===0) {
                controls.getArray($el,de);
            }
            var $el= $(this),
                $ul= $el.find(de.items);
            de.romoteArray = romoteArray;
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
    romoteArray = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','1.jpg','2.jpg','3.jpg'];
    $('.slider').silder({
        number : 3,         //图数量
        gundong:1,          //滚动数量
        savenumber: 6,      //保存数量为number整数倍 不保存null，保存时回滚关闭
        autochange:true,    //是否自动适应平铺
        autoplay:false,      //自动播放
        arrow:true,         //有箭头
        duration:3000,      //自动播放时延迟
        speed:200,          //箭头滚动速度
        autospeed:'slow',   //自动播放速度
});
});











