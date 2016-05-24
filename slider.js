(function($){
    var array=[];
    var silde = {
        init:function(a,number,gundong,status){
            var linumber= number + 1,
                $ul = $(a).find("ul"),
                $lis = $ul.children("li"),
                width = $lis.eq(0).width(),
                mf=parseInt($ul.css('margin-left')),
                numberaccout = number || 4,
                lanumber= $lis.length;
            for (var i = linumber-1; i < lanumber; i++) {
                array.push($ul.find("img")[i].src);
                console.log(array);
                $ul.find("img")[i].src = '';
            }
            $('.arrow-right').click(function(){
                if(-parseInt($ul.css('margin-left'))>($lis.length-numberaccout-1)*width){
                    return;
                }
                mf = parseInt($ul.css('margin-left')) -width;
                index = -mf/width+number-1;
                if(index>(number-1)){
                    $ul.find("img")[index].src=array[index-number];
                }
                $ul.stop().animate({
                        'margin-left':mf +'px'
                    },
                    'fast');
                });
            $('.arrow-left').click(function(){
                if(-parseInt($ul.css('margin-left')) < width){
                    return;
                }
                mf = parseInt($ul.css('margin-left')) +width;
                $ul.stop().animate({
                        'margin-left':mf +'px'
                    },
                    'fast');
                }
            );
            this.auto(a,number,gundong,status);
        },
        auto:function(a,number,gundong,status){
            //slider效果
            var _root = this,
                $ul = $(a).find("ul"),
                $lis = $ul.children("li"),
                linumber= number + 1,
                width = $lis.eq(0).width(),
                numberaccout = number || 4,
                lanumber= $lis.length,
                gundongaccout = gundong || 1,
                auto_status = status || true,
                mf=parseInt($ul.css('margin-left')),
                havesend=0;
            $(a).css({'width':width*numberaccout});
                if(auto_status){
                    timemachine=setInterval(function(){
                        if(-mf<($lis.length-numberaccout)*width){
                            mf = mf -width*gundong;
                        }else{
                            mf = 0;
                        }
                        index = -mf/width+number-1;
                        if(index>(number-1)){
                            $ul.find("img")[index].src=array[index-number];
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
                silde.auto(a,number,gundong,auto_status);
            });
        }
    };
    $(function(){
        silde.init('.slider',3,3,true);
    });
})(jQuery);