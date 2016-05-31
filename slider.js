(function($){
    // 声明图片
    var array_remote=['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg'];
    var array=array_remote,arrayindex;
    var silde = {
        init:function(a,number,gundong,status){
            var linumber= number + 1,
                $ul = $(a).find("ul"),
                $lis = $ul.children("li"),
                mf=parseInt($ul.css('margin-left')),
                gundongaccout = gundong || 1,
                numberaccout = number || 4,
                containWidth = $(a).parent().css('width'),
                width = parseInt(containWidth)/number,
                lanumber= $lis.length;
            this.pingmu(a,numberaccout,$ul,number);
            $('.arrow-right').click(function(){
                if(-parseInt($ul.css('margin-left'))>($lis.length-numberaccout-1)*width){
                    return;
                }
                mf = parseInt($ul.css('margin-left')) -width*gundongaccout;
                index = -mf/width+number-1;
                if(gundongaccout===1){
                    if(index>(numberaccout-1)){
                        $ul.find("img")[index].src=array[index];
                    }
                }else{
                        for (var i = 0; i < gundongaccout; i++) {
                            console.log(i);
                            $ul.find("img")[i+numberaccout].src=array[i+numberaccout];
                        }
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
                mf = parseInt($ul.css('margin-left')) +width*gundongaccout;
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
            var width = parseInt($(a).parent().css('width'))/number;
            $(a).css({'width':$(a).parent().css('width')});
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
            var width = parseInt($(a).parent().css('width'))/number;
            for (var j = 0; j < gundongaccout; j++) {
                if(array.length===0){return;}
                $("<li><img style='width:"+width+";'></li>").appendTo($ul);
                $(a).find("img")[$(a).find("img").length-1].src = array.shift();
            }
        },
        auto:function(a,numberaccout,gundongaccout,status){
            //slider效果
            var _root = this,
                $ul = $(a).find("ul"),
                $lis = $ul.children("li"),
                linumber= numberaccout + 1,
                lanumber= $lis.length,
                auto_status = status,
                mf=parseInt($ul.css('margin-left')),
                havesend=0;
                if(auto_status){
                    timemachine=setInterval(function(){
                        var width = parseInt($(a).parent().css('width'))/numberaccout;
                        if(-mf<($lis.length-numberaccout)*width){
                            mf = mf -width*gundongaccout;
                        }else{
                            mf = 0;
                        }
                        index = -mf/width+numberaccout-1;
                        if(gundongaccout===1){
                            if(index>(numberaccout-1)){
                                $ul.find("img")[index].src=array[index];
                            }
                        }else{
                                for (var i = 0; i < gundongaccout; i++) {
                                    console.log(i);
                                    $ul.find("img")[i+numberaccout].src=array[i+numberaccout];
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