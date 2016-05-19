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
                mf=parseInt($ul.css('margin-left'));
            $(a).css({'width':width*numberaccout});
            timemachine=setInterval(function(){
                if(-mf<($lis.length-numberaccout)*width){
                    mf = mf - width;
                }else{
                    mf = 0;
                }
                $ul.animate({
                        'margin-left': mf +'px'
                    },
                    'slow',

                    function(){
                        if (status === true) {
                        //此处保证能循环轮播
                        //将已经轮播过的节点的第一张图片添加到末尾的位置
                        //再将margin-left重置为0px;
                        //这样就能一直的循环下去.
                        $ul.css({'margin-left': 0 +'px'}).
                            children('li').
                            last().
                            after(
                                $ul.children('li').slice(0, gundongaccout)
                            );
                        }
                    });
                },3000
            );
            // $('.slider').hover(function(){
            //     window.clearInterval(timemachine);
            // });
            // $('.slider').mouseleave(function(){
            //     silde.init(a,number,gundong,status);
            // });
            $('.arrow-right').click(function(){
                    $ul.animate({
                            'margin-left':'-'+ gundongaccout*width +'px'
                        },
                        'slow',
                        function(){
                            //此处保证能循环轮播
                            //将已经轮播过的节点的第一张图片添加到末尾的位置
                            //再将margin-left重置为0px;
                            //这样就能一直的循环下去.
                            if (status) {
                            $ul.
                                children('li').
                                last().
                                after(
                                    $ul.children('li').slice(0, gundongaccout)
                                );
                            $ul.css({'margin-left':'-'+ gundongaccout*width +'px'});
                        }
                        });
                    }
                );
            $('.arrow-left').click(function(){
                $ul.animate({
                        'margin-left':0 +'px'
                    },
                    'slow',
                    function(){
                        //此处保证能循环轮播
                        //将已经轮播过的节点的第一张图片添加到末尾的位置
                        //再将margin-left重置为0px;
                        //这样就能一直的循环下去.
                         if (status) {
                        $ul.
                            children('li').
                            first().
                            before(
                                $ul.children('li').slice(-1)
                            );
                        $ul.css({'margin-left':'-'+ gundongaccout*width +'px'});
                    }
                    });
                }
            );
        }
    };
    $(function(){
        silde.init('.slider',3,1,false);
    });
})(jQuery);