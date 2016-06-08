(function ($) {
    var controls = {
        //自动适应
        windowsize : function(a,de){
            var imgWarp = Math.floor(parseInt($(a).parent().css('width'))/de.number)*de.number+'px';
            var imgW = Math.floor(parseInt($(a).parent().css('width'))/de.number)+'px';
            $(a).css('width', imgWarp);
            $(a).find('img').css('width', imgW);
        },
        //获取数据
        getArray: function(a,de){
            var width = de.parentW/de.number;
            //初始化图片地址数组
            if(de.indx === 0 ){
                if(de.savenumber){
                    de.array=romoteArray.slice(de.indx, de.indx + de.savenumber);
                    de.indx += de.savenumber;
                }else{
                    de.array=romoteArray.slice(de.indx, de.indx + de.number+1);
                    de.indx += de.number+1;
                }
            }else{
                //排布已经取得的图片地址，远程图片取完则不再取
                if (romoteArray[de.indx]) {
                    if(de.mf !==0){
                        de.array = romoteArray.slice(de.indx,de.indx+de.gundong);
                        de.indx += de.gundong;
                        controls.deleteImg(a,de);
                    }
                }else{
                    de.reach = 1;
                }
            }
        },
        //初始添加图片
        addimage : function(a,de){
            //添加初始图片
            var width = de.parentW/de.number+'px';
            $(a).css({'width':width*de.number});
            $(a).find(de.items).css({'width':width*de.number});
            if(de.savenumber){
                for (var j = 0; j < de.savenumber; j++) {
                    $("<li><img src="+de.array[0]+" style='width:"+width+";'></li>").appendTo($(a).find(de.items));
                    de.array.shift();
                }
            }else{
                for (var i = 0; i < de.array.length; i++) {
                    $("<li><img src="+de.array[i]+" style='width:"+width+";'></li>").appendTo($(a).find(de.items));
                    de.array.shift();
                }
            }
        },
        //自动播放
        autoplay : function(a,de){
            de.mf=parseInt($(a).find(de.items).css('margin-left'));
            timemachine=setInterval(function(){
            controls.right(a,de);
                },de.duration
            );
        },
        //停止
        stop : function(){
            window.clearInterval(timemachine);
        },
        //往右
        right : function(a,de){
            var width = de.parentW/de.number;
            var alen = $(a).find(de.items).children('li').length-de.number;

            //访问到最后一个退出
            if(de.reach ===1){
                return;
            }
            de.beign = 0;
            //图片最右边靠最右边
            if ($(a).find(de.items).css('margin-left')===(de.number-de.savenumber)*width+'px') {
                 de.begin = 1;
            }
            if (de.begin===1) {
                controls.getArray(a,de);
                // if(de.reach ===1){
                //     return;
                // }
                $(a).find(de.items).css('margin-left', (de.number-de.savenumber+de.gundong)*width);
                controls.createImg(a,de);
            }
            de.mf = parseInt($(a).find(de.items).css('margin-left')) -width*(de.gundong);
            $(a).find(de.items).stop().animate({
                    'margin-left': de.mf +'px'
                },
                de.speed);
        },
        //往左
        left : function(a,de){
            de.reach = 0;
            controls.leftadd(a,de);
            if(-parseInt($(a).find(de.items).css('margin-left')) < 0){
                return;
            }
            var width = de.parentW/de.number;
            de.mf = parseInt($(a).find(de.items).css('margin-left')) +width*de.gundong;
            if(de.mf>0){
                de.mf = 0;
            }
            $(a).find(de.items).stop().animate({
                    'margin-left':de.mf +'px'
            },de.speed);
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
                loading:'loading.gif'
            };
            de = $.extend({},de, o);
            if (de.array.length===0) {
                controls.getArray($el,de);
            }
            var $el= $(this),
                $ul= $el.find(de.items);
            var parentW =  Math.floor(parseInt($el.parent().css('width'))/de.number)*de.number+'px';
            de.parentW = Math.floor(parseInt($el.parent().css('width'))/de.number)*de.number;
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
    var lazyload = {
        change:function(a,de) {
            var width = de.parentW/de.number;
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
        savenumber: null,      //保存数量为number整数倍 不保存null，保存时回滚关闭
        autochange:true,    //是否自动适应平铺
        autoplay:false,      //自动播放
        arrow:true,         //有箭头
        duration:3000,      //自动播放时延迟
        speed:200,          //箭头滚动速度
        autospeed:'slow',   //自动播放速度
        loading:null
});
});
