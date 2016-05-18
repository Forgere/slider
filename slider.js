(function($){
    var silde = {
        init:function(a){
            this.auto(a);
        },
        auto:function(a){
            var _root = this,
                $ul = $(a).find("ul"),
                $lis = $ul.children("li"),
                width = $lis.eq(0).width();
            timemachine=setInterval(function(){
                $ul.animate({
                        'margin-left':'-'+ width +'px'
                    },
                    'slow',
                    function(){
                        //此处保证能循环轮播
                        //将已经轮播过的节点的第一张图片添加到末尾的位置
                        //再将margin-left重置为0px;
                        //这样就能一直的循环下去.
                        $ul.css({'margin-left':0}).
                            children('li').
                            last().
                            after(
                                $ul.children('li').first()
                            );
                    });
                },3000
            );
            $('.sliders').hover(function(){
                window.clearInterval(timemachine);
            });
            $('.sliders').mouseleave(function(){
                silde.init(a);
            });
        }
    };
})(jQuery);