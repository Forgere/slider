(function ($) {
    var controls = {
        windowsize : function(a,number){
            $(a).find('img').css('width', Math.floor($(a).width()/number)+'px');
        },
        addimage : function(a,number,array){
            //添加初始图片
            var width = Math.floor($(a).width()/number)+'px';
            console.log(width);
            $(a).css({'width':width*number});
            for (var j = 0; j < number; j++) {
                $("<li><img src="+array[0]+" style='width:"+width+";'></li>").appendTo($(a).find('ul'));
                array.shift();
            }
        },
    };
    var methods = {
        init: function (el,o) {
            var de = {
                number : 4,
                gundong : 1,
                status : true,
                items : 'ul',
                item : '>li',
                autoplay: 'true',
                autochange:'true',
                // slid : '.slider',
                array : ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg']
            };
            de = $.extend({},de, o);
            var $el= $(this),
                $ul= $el.find(de.items),
                cache= {};
            if(de.autochange){
                $(window).resize(function() {
                    /* Act on the event */
                    controls.windowsize($el, de.number);
                });
            }
            // for (var j = 0; j < de.number; j++) {
            //     width =  Math.floor($(this).width()/de.number)+'px';
            //     $("<li><img style='width:"+width+";'></li>").appendTo($(de.slid));
            //     $(de.slid).find("img")[j].src = de.array.shift();
            // }
            controls.addimage($el, de.number,de.array);
        },
        createImg : function(ele){
            var width = Math.floor(parseInt($(a).parent().css('width'))/number);
            for (var j = 0; j < gundongaccout; j++) {
                if(array.length===0){return;}
                $("<li><img style='width:"+width+";'></li>").appendTo($ul);
                $(a).find("img")[$(a).find("img").length-1].src = array.shift();
                // $(a).find("img").last().src = array.shift();
            }
        },
        auto : function(a,numberaccout,gundongaccout,status){
            //slider效果
            var _root = this,
                $ul = $(a).find("ul"),
                $lis = $ul.children("li"),
                lanumber= $lis.length,
                auto_status = status,
                alen = arraylength - numberaccout,
                havesend=0;
                //滚动
                if(auto_status){
                    timemachine=setInterval(function(){
                        var width = Math.floor(parseInt($(a).parent().css('width'))/numberaccout);
                        //滚动限制
                        var mf=parseInt($ul.css('margin-left'));
                        if(mf==(-alen)*width){
                            mf = 0;
                        }else{
                            mf = parseInt($ul.css('margin-left')) -width*gundongaccout;
                            if(-mf>(alen)*width){
                                mf=(-alen)*width;
                            }
                        }
                        $ul.stop().animate({
                                'margin-left': mf +'px'
                            },
                            'slow');
                        _root.createImg(a,gundongaccout,$ul,numberaccout);
                        },3000
                    );
                    // 接触时暂停
                    $('.slider').hover(function(){
                        window.clearInterval(timemachine);
                    });
                    // 鼠标移开
                    $('.slider').mouseleave(function(){
                        silde.auto(a,numberaccout,gundongaccout,status);
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
    $('.slider').silder();
});