(function($){
    var silde = {
        init:function(a,number,gundong,status){
            this.auto(a,number,gundong,status);
        },
        auto:function(a,number,gundong,status){
            var _root = this,
                $ul = $(a).find("ul"),
                $lis = $ul.children("li"),
                width = $lis.eq(0).width(),
                numberaccout = number || 4,
                gundongaccout = gundong || 1,
                auto_status = status || true,
                mf=parseInt($ul.css('margin-left'));
            $(a).css({'width':width*numberaccout});
                if(auto_status){
                    timemachine=setInterval(function(){
                        if(-mf<($lis.length-numberaccout)*width){
                            mf = mf - width;
                        }else{
                            mf = 0;
                        }
                        $ul.stop().animate({
                                'margin-left': mf +'px'
                            },
                            'slow');
                        },3000
                    );
                }
            // 接触时暂停
            $('.slider').hover(function(){
                window.clearInterval(timemachine);
            });
            // 鼠标移开
            $('.slider').mouseleave(function(){
                silde.init(a,number,gundong,auto_status);
            });
            $('.arrow-right').click(function(){
                if(-mf>($lis.length-numberaccout-1)*width){
                    return;
                }
                mf -= width;
                $ul.stop().animate({
                        'margin-left':mf +'px'
                    },
                    'fast');
                });
            $('.arrow-left').click(function(){
                if(mf === 0){
                    return;
                }
                mf += width;
                $ul.stop().animate({
                        'margin-left':mf +'px'
                    },
                    'fast');
                }
            );
        }
    };
    $(function(){
        silde.init('.slider',3,1,true);
    });
})(jQuery);