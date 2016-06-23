(function ($) {
  var Slider = function () {
    that = this;
    //  默认参数
    this.o = {
      number: 4,              //显示都少图片
      savenumber: null,       //前后保存数量
      items: '>ul',           //容器子元素
      item: '>li',            //容器孙元素
      autoplay: false,        //自动滚动
      loop: false,            //无线滚动
      autochange: false,      //适应屏幕
      duration: 3000,         //间隔
      arrows: true,           //箭头
      prev: '&larr;',
      next: '&rarr;',
      speed: 200,             //滚动速度
      autospeed: 'slow',      //自动滚动速度
      array: [],              //添加图片使用的数组
      cache: [],              //缓存图片地址数组
      easing: 'swing',        //animate数组
      lazyload: true,         //lazyload
      loading: '',            //lazy图片
      fadeIn: false,          //fadeIN效果
      romoteArray: '',        //动态加入图片
      ajaxcallback: false,     //ajax回调数组 url success类型默认get json；若动态改变则在whichchange中写入改变的参数
      innerHTML:'<li><img></li>'     //包括li在内的html结构
    };

    this.init = function (el, o) {
      //  信息合并
      this.o = $.extend(this.o, o);
      this.el = el;
      this.ul = el.find(this.o.items);
      this.li = this.ul.find(this.o.item);
      this.parentW = Math.floor(parseInt(el.parent().css('width')) / this.o.number) * this.o.number;
      this.liWidth = this.parentW / this.o.number;
      //  当前图片index
      this.i = 0;
      //现有图片到底事件
      this.el.bind('reachLastImage', this.el, function(event) {
        that.ajaxcallback(that.o.ajaxcallback.url,that.o.ajaxcallback.success,that.o.ajaxcallback.whichchange,that.o.ajaxcallback.type,that.o.ajaxcallback.datatype);
      });
      //已加载图片的最大index
      this.maxI = this.o.number;
      if(this.o.romoteArray){
        //初始加赞图片
        this.o.array = this.o.romoteArray.slice(this.i, this.i + this.o.number);
        for (var i = 0; i < this.o.number; i++) {
          this.addImage(this.o.array, 'right', this.i,this.o.innerHTML);
          this.i++;
          this.onreachLastImage();
        }
      }
      // this.onAddEvent(1,'click',function(){alert(1);});
      //高度
      this.ul.height('100%');
      //  Autoslide
      this.o.autoplay && setTimeout(function () {
        if (that.o.duration | 0) {
          if (that.o.autoplay) {
            that.play();
          }
          that.el.on('mouseover mouseout', function (e) {
            that.stop();
            that.o.autoplay && e.type == 'mouseout' && that.play();
          });
        }
      }, 0);
      //  Dot pagination
      this.o.dots && nav('dot');

      //  Arrows support
      if (this.o.arrows) {
        nav('arrow');
      }
      //  Patch for fluid-width sliders. Screw those guys.
      if (this.o.autochange) {
        $(window).resize(function () {
          var sliderWidth = that.liWidth * that.o.number;
          that.r && clearTimeout(that.r) && clearTimeout(that.protectTime);
          that.r = setTimeout(function () {
            var beforeSaveLiList = that.el.find(that.o.items).children('li');
            var beforeSaveWidth = parseInt(that.el.find(that.o.items).children('li').eq(0).outerWidth());
            that.el.width(sliderWidth);
            that.el.find('img').width(sliderWidth / that.o.number);
            var liWidth = beforeSaveLiList.eq(0).outerWidth();
            for (var i = 0; i < beforeSaveLiList.length; i++) {
              if (that.i === that.maxI) {
                beforeSaveLiList.eq(i).css('left', liWidth * (that.i - beforeSaveLiList.length + i));
              } else if (that.maxI - that.o.savenumber > that.i) {
                beforeSaveLiList.eq(i).css('left', liWidth * (parseInt(beforeSaveLiList.eq(beforeSaveLiList.length - 1).css('left')) / that.liWidth + 1 - beforeSaveLiList.length + i));
              } else if (that.o.savenumber > that.maxI - that.i) {
                beforeSaveLiList.eq(i).css('left', liWidth * (that.maxI - beforeSaveLiList.length + i));
              }
            }
            that.el.find(that.o.items).css('left', (that.o.number - that.i) * liWidth);
          }, 50);
        }).resize();
      }
      if(this.o.savenumber){
        setInterval(
          function () {
            that.protect();
          }, 2000);
        return this;
      }
    };
    //basic ///////////////////////////////////////////////////
    //  根据this.i移动ul
    this.to = function (index, callback) {
      if (this.t) {
        this.stop();
        this.play();
      }
      var o = this.o,
        el = this.el,
        ul = this.ul,
        li = this.li,
        current = this.i;
      //  slider到达边缘条件
      if ((this.o.romoteArray.length + 1 === this.i) && o.loop === false) {
        this.i = index;
        return;
      }
      if (index < this.o.number && o.loop === false) {
        this.i = this.o.number;
        return;
      }

      var speed = callback ? 5 : o.speed | 0,
        easing = o.easing,
        obj = {};

      if (!ul.queue('fx').length) {
        el.animate(obj, speed, easing) && ul.animate($.extend({
          left: (this.o.number - index) * this.liWidth
        }, obj), speed, easing, function (data) {
          that.maxI = (index > that.maxI) ? index : that.maxI;
        });
      }
    };

    //  自动增加index
    this.play = function () {
      that.t = setInterval(function () {
        that.el.find('.next').trigger('click');
      }, that.o.duration | 0);
    };

    //  Stop
    this.stop = function () {
      that.t = clearInterval(that.t);
      return that;
    };

    //  右箭头
    this.next = function () {
      if(this.ul.queue('fx').length)return;
      if (this.o.romoteArray.length === this.i) {
        this.onNoLoopReachEnd();
        return;
      }
      this.onreachLastImage();
      this.i++;
      this.getArray(this.i - 1, this.i);
      //判断要添加的图片是否不存在
      var lastImageLeft = parseInt(this.el.find(this.o.items).children('li').last().css('left'));
      var width = Math.floor(parseInt(this.el.parent().css('width')) / this.o.number);
      var lastImageIndex = lastImageLeft / width - 1;
      if (this.i > lastImageIndex) {
        this.addImage(this.o.array, 'right', this.i - 1,this.o.innerHTML);
      }
      return this.to(this.i);
    };
    //  左箭头
    this.prev = function () {
      this.i--;
      if (this.o.number === this.i + 1) {
        this.onNoLoopReachFirst();
        return;
      }
      if (this.o.savenumber) {
        var firstImageLeft = parseInt(this.el.find(this.o.items).children('li').first().css('left'));
        var width = Math.floor(parseInt(this.el.parent().css('width')) / this.o.number);
        var firstImageIndex = firstImageLeft / width;
        this.getArray(this.i - this.o.number, this.i - this.o.number + 1);
        //判断要添加的图片是否不存在
        if (this.i - this.o.number < firstImageIndex) {
          this.addImage(this.o.array, 'left', this.i + 1);
        }
      }
      return this.to(this.i);
    };
    //  Create dots and arrows
    function nav(name, html) {
      if (name == 'dot') {
        html = '<ol class="dots">';
        $.each(this.li, function (index) {
          html += '<li class="' + (index == this.i ? name + ' active' : name) + '">' + ++index + '</li>';
        });
        html += '</ol>';
      } else {
        html = '<div class="';
        html = html + name + 's">' + html + name + ' prev">' + that.o.prev + '</div>' + html + name + ' next">' + that.o.next + '</div></div>';
      }

      that.el.addClass('has-' + name + 's').append(html).find('.' + name).click(function () {
        var me = $(this);
        me.hasClass('dot') ? that.stop().to(me.index()) : me.hasClass('prev') ? that.prev() : that.next();
      });
    }
    var urlid = 0;
    this.ajaxcallback=function(geturl,successFunc,whichChange,getType,getdataType){
      if(that.o.romoteArray){
        if(whichChange){
          var reg=/id=(\w)/;
          var originId = parseInt(geturl.match(reg)[1]) + urlid;
          geturl = geturl.split(reg)[0] + whichChange+'=' + originId +geturl.split(reg)[2];
          urlid++;
        }
        $.ajax({
          url: geturl,
          type: getType || 'GET',
          dataType: getdataType || 'json',
          success:successFunc
        });
      }
    },
    this.getArray = function (from, to) {
      if(this.o.romoteArray){
        if (to <= this.maxI) {
          if (this.o.cache[from] == null || undefined) {
            this.o.array = [];
          } else {
            this.o.array[0] = this.o.cache[from];
          }
        } else {
          this.el.bind('addNewImage', this.el, function(event) {
            that.o.array = that.o.romoteArray.slice(from, to);
          });
          this.onaddNewImage();
        }
        return this.o.array;
      }
    },
    //自定义html
    this.addImage = function (array, direction, index, inner) {
      if(this.o.romoteArray){
        if (array.length === 0) {
          return;
        }
        //lazyload support
        if (this.o.lazyload) {
          this.lazyload(array, direction, index ,that.o.innerHTML);
        } else {
          $(inner).css('left',(this.i - 1) * this.liWidth + 'px').appendTo(this.ul).find('img').width(this.liWidth);
          array.shift();
        }
      }
    },
    this.lazyload = function (array, direction, index,inner) {
      var creatImg = $(inner);
      creatImg.css('left',index * this.liWidth+'px').find('img').width(this.liWidth).attr('src', this.o.loading);
      if (direction === 'left') {
        creatImg.css('left',(index - this.o.number - 1) * this.liWidth + 'px').prependTo(this.ul).find('img').width(this.liWidth);
      } else {
        creatImg.appendTo(this.ul);
      }
      var tmpimg = $("<img src=" + array[0] + ">");
      tmpimg.ready(function () {
        setTimeout(function () {
          //fadeIn
          if (that.o.fadeIn) {
            creatImg.find('img').attr('src', tmpimg.attr('src')).hide().fadeIn('slow');
          } else {
            creatImg.find('img').attr('src', tmpimg.attr('src'));
          }
        }, 1000);
      });
      array.shift();
    },
    this.protect = function () {
      if (this.o.savenumber) {
        this.protectTime = setTimeout(
          function () {
            that.protectMemory();
          }, 1000);
      }
    },
    //保护内存
    this.protectMemory = function () {
      //留下的图片的index 从0开始
      var protectededFirst = this.i - (this.o.number + this.o.savenumber);
      var protectededLast = this.i + this.o.savenumber - 1;
      //限制修正这两个index
      protectededFirst = (protectededFirst < 0) ? 0 : protectededFirst;
      protectededLast = (protectededLast > this.maxI) ? this.maxI : protectededLast;
      var currentLiList = this.el.find(this.o.items).children('li');
      var liEachWidth = this.liWidth;
      //删除其他图片
      for (var i = 0; i < currentLiList.length; i++) {
        var liEachLeft = parseInt(currentLiList.eq(i).css('left'));
        var eachImageIndex = liEachLeft / liEachWidth;
        if (eachImageIndex < protectededFirst || eachImageIndex > protectededLast) {
          //保存数据
          this.o.cache[eachImageIndex] = currentLiList.eq(i).find('img').attr('src');
          currentLiList.eq(i).remove();
        }
      }
    },
    //给某一个li添加事件
    this.onAddEvent = function(index,event,func){
      $.each(that.ul.children('li'),function(i){
        if(parseInt(that.ul.children('li').eq(i).css('left'))/that.liWidth === index){
          that.ul.on(event, this, function(event) {
            event.stopPropagation();
            func();
          });
        }
      });
    },
    //第一张
    this.onNoLoopReachFirst = function(){
      that.el.trigger('noLoopReachFirst');
    },
    //最后一张
    this.onNoLoopReachEnd = function(){
      that.el.trigger('noLoopReachEnd');
    },
    //新添一张
    this.onaddNewImage = function(){
      that.el.trigger('addNewImage');
    },
    //何时触发reachLastImage最后一张
    this.onreachLastImage = function(){
      if (this.o.romoteArray.length - 1 === this.i){
        //到底 外获取
        if (that.o.ajaxcallback && that.o.romoteArray) {
          that.el.trigger('reachLastImage');
        }
      }
    }
  };

  //  Create a jQuery plugin
  $.fn.slider2 = function (o) {
    var len = this.length;

    //  Enable multiple-slider support
    return this.each(function (index) {
      //  Cache a copy of $(this), so it
      var me = $(this),
        key = 'unslider' + (len > 1 ? '-' + ++index : ''),
        instance = (new Slider).init(me, o);

       // Invoke an Unslider instance
      me.data(key, instance).data('key', key);
    });
  };

})(jQuery);