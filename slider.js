(function($){
    // 声明图片
    var array_remote=['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg'];
    var array=array_remote,arrayindex,
        arraylength = array.length;
    var silde = {
        init:function(a,number,gundong,status){
            //滚动数量修正
            gundong=(number<gundong)?number:gundong;
            var $ul = $(a).find("ul"),
                gundongaccout = gundong || 1,
                numberaccout = number || 4,
                alen = array.length,
                containWidth = $(a).parent().css('width'),
                width = Math.floor(parseInt(containWidth)/number),
                _self=this;
            this.pingmu(a,numberaccout,$ul,number);
            $('.arrow-right').click(function(){
                var mf=parseInt($ul.css('margin-left'));
                if(-mf>=(alen-numberaccout)*width){return;}
                mf = parseInt($ul.css('margin-left')) -width*gundongaccout;
                if(-mf>(alen-numberaccout)*width){
                    mf=(numberaccout-alen)*width;
                }
                $ul.stop().animate({
                        'margin-left':mf +'px'
                    },
                    'fast');
                _self.createImg(a,gundongaccout,$ul,numberaccout);
            });
            $('.arrow-left').click(function(){
                if(-parseInt($ul.css('margin-left')) < 0){
                    return;
                }
                mf = parseInt($ul.css('margin-left')) +width*gundongaccout;
                if(mf>0){ mf = 0;}
                $ul.stop().animate({
                        'margin-left':mf +'px'
                    },
                    'fast');
                }
            );
            this.auto(a,numberaccout,gundongaccout,status);
        },
        pingmu:function(a,numberaccout,$ul,number){
            //父容器自适应宽度
            var width = Math.floor(parseInt($(a).parent().css('width'))/number);
            console.log($(a).parent());
            $(a).css({'width':width*numberaccout});
            for (var j = 0; j < numberaccout; j++) {
                $("<li><img style='width:"+width+";'></li>").appendTo($ul);
                $ul.find("img")[j].src = array.shift();
            }
            //屏幕尺寸变化时
            $(window).resize(function(){
                var width = parseInt($(a).parent().css('width'))/number;
                $(a).css({'width':$(a).parent().css('width')});
                $(a).find('img').css('width', width);
            });
        },
        createImg:function(a,gundongaccout,$ul,number){
            var width = Math.floor(parseInt($(a).parent().css('width'))/number);
            for (var j = 0; j < gundongaccout; j++) {
                if(array.length===0){return;}
                $("<li><img style='width:"+width+";'></li>").appendTo($ul);
                $(a).find("img")[$(a).find("img").length-1].src = array.shift();
                // $(a).find("img").last().src = array.shift();
            }
        },
        auto:function(a,numberaccout,gundongaccout,status){
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
    $(function(){
        silde.init('.slider',3,1,true);
    });
})(jQuery);