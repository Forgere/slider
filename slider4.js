(function ($) {
  $.fn.slider = function (options) {
    var $that = $(this);
    var defaults = {
      imageindex: 0,
      number: 4,
      gundong: 1,
      savenumber: null,
      items: '>ul',
      item: '>li',
      autoplay: true,
      loop: false,
      autochange: true,
      duration: 3000,
      arrows: true,
      prev: '&larr;',
      next: '&rarr;',
      speed: 500,
      autospeed: 'slow',
      array: [],
      cache: [],
      easing: 'swing',
      lazyload: true,
      loading: 'loading.gif',
      fadeIn: false
    };
    options = $.extend(defaults, options);
    $el = $that;
    $ul = $that.find(options.items);
    $li = $ul.find(options.item);
    this.each(function () {
      init = function () {
        //  信息合并
        $parentW = Math.floor(parseInt($el.parent().css('width')) / options.number) * options.number;
        $liWidth = $parentW / options.number;
        //  当前图片index
        $that.i = 0;
        //已加载图片的最大index
        $that.maxI = options.number;
        //初始加赞图片
        options.array = romoteArray.slice($that.i, $that.i + options.number);
        if (options.lazyload) {
          for (var i = 0; i < options.number; i++) {
            addImage(options.array, 'right', $that.i);
            $that.i++;
          }
        } else {
          for (var j = 0; j < options.number; j++) {
            $("<li style='left:" + $that.i * $parentW / options.number + 'px' + "'><img src=" + options.array[0] + " style='width:" + $liWidth + ";'></li>").appendTo($ul);
            $that.i++;
            //清空数组
            options.array.shift();
          }
        }
        //高度
        $ul.height('100%');
        //  Autoslide
        options.autoplay && setTimeout(function () {
          if (options.duration | 0) {
            if (options.autoplay) {
              _.play();
            }
            $el.on('mouseover mouseout', function (e) {
              _.stop();
              options.autoplay && e.type == 'mouseout' && _.play();
            });
          }
        }, 0);
        //  Dot pagination
        options.dots && nav('dot');
        //  Arrows support
        if (options.arrows) {
          nav('arrow');
        }
        //  Patch for fluid-width sliders. Screw those guys.
        if (options.autochange) {
          $(window).resize(function () {
            var sliderWidth = Math.floor(parseInt($el.parent().css('width')) / options.number) * options.number;
            $that.r && clearTimeout($that.r);
            $that.r = setTimeout(function () {
              var beforeSaveLiList = $el.find(options.items).children('li');
              var beforeSaveWidth = parseInt($el.find(options.items).children('li').eq(0).width());
              $el.width(sliderWidth);
              $el.find('img').width(sliderWidth / options.number);
              var liWidth = beforeSaveLiList.eq(0).width();
              for (var i = 0; i < beforeSaveLiList.length; i++) {
                var beforeIndex = Math.floor(parseInt(beforeSaveLiList.eq(i).css('left')) / beforeSaveWidth);
                beforeSaveLiList.eq(beforeIndex).css('left', liWidth * beforeIndex);
              }
              $el.find(options.items).css('left', (options.number - $that.i) * liWidth);
            }, 50);
          }).resize();
        }
        $el.hover(function () {
          /* Stuff to do when the mouse enters the element */
          clearInterval($that.protectTime);
        }, function () {
          protect();
        });
        return $that;
      }();

      function getArray(from, to) {
        if (to <= $that.maxI) {
          if (options.cache[from] == null || undefined) {
            options.array = [];
          } else {
            options.array[0] = options.cache[from];
          }
        } else {
          options.array = romoteArray.slice(from, to);
        }
        return options.array;
      }

      function addImage(array, direction, index) {
        if (array.length === 0) {
          return;
        }
        //lazyload support
        if (options.lazyload) {
          lazyload(array, direction, index);
        } else {
          // if (array[0] === '' || !array[0]) {array.shift();}
          $("<li style='left:" + ($that.i - 1) * Math.floor(parseInt($el.parent().css('width')) / options.number) + 'px' + "'><img src=" + array[0] + " style='width:" + Math.floor(parseInt($el.parent().css('width')) / options.number) + ";'></li>").appendTo(_.ul);
          array.shift();
        }
      }

      function lazyload(array, direction, index) {
        var creatImg = $("<li style='left:" + index * Math.floor(parseInt($el.parent().css('width')) / options.number) + 'px' + "'><img src=" + options.loading + " style='width:" + Math.floor(parseInt($el.parent().css('width')) / options.number) + ";'></li>");
        if (direction === 'left') {
          creatImg = $("<li style='left:" + (index - options.number - 1) * Math.floor(parseInt($el.parent().css('width')) / options.number) + 'px' + "'><img src=" + options.loading + " style='width:" + Math.floor(parseInt($el.parent().css('width')) / options.number) + ";'></li>");
          creatImg.prependTo($ul);
        } else {
          creatImg.appendTo($ul);
        }
        var tmpimg = $("<img src=" + array[0] + ">");
        tmpimg.ready(function () {
          setTimeout(function () {
            //fadeIn
            if (options.fadeIn) {
              creatImg.find('img').attr('src', tmpimg.attr('src')).hide().fadeIn('slow');
            } else {
              creatImg.find('img').attr('src', tmpimg.attr('src'));
            }
          }, 1000);
        });
        array.shift();
      }

      function nav(name, html) {
        if (name == 'dot') {
          html = '<ol class="dots">';
          $.each($li, function (index) {
            html += '<li class="' + (index == $that.i ? name + ' active' : name) + '">' + ++index + '</li>';
          });
          html += '</ol>';
        } else {
          html = '<div class="';
          html = html + name + 's">' + html + name + ' prev">' + options.prev + '</div>' + html + name + ' next">' + options.next + '</div></div>';
        }

        $el.addClass('has-' + name + 's').append(html).find('.' + name).click(function () {
          var me = $(this);
          me.hasClass('dot') ? stop().to(me.index()) : me.hasClass('prev') ? prev() : next();
        });
      }

      function stop() {
        $that.t = clearInterval($that.t);
        return $that;
      }
      function play() {
        $that.t = setInterval(function () {
          to($that.i + 1);
        }, options.duration | 0);
      }

      function protect() {
        if (options.savenumber) {
          $that.protectTime = setTimeout(
            function () {
              protectMemory();
            }, 100);
        }
      }

      function protectMemory() {
        //留下的图片的index 从0开始
        var protectededFirst = $that.i - (options.number + options.savenumber);
        var protectededLast = $that.i + options.savenumber;
        //限制修正这两个index
        protectededFirst = (protectededFirst < 0) ? 0 : protectededFirst;
        protectededLast = (protectededLast > $that.maxI) ? $that.maxI : protectededLast;
        console.log(protectededFirst);
        console.log($that.maxI);
        console.log(protectededLast);
        var currentLiList = $el.find(options.items).children('li');
        var liEachWidth = Math.floor(parseInt($el.parent().css('width')) / options.number) * options.number / options.number;
        //删除其他图片
        for (var i = 0; i < currentLiList.length; i++) {
          var liEachLeft = parseInt(currentLiList.eq(i).css('left'));
          var eachImageIndex = liEachLeft / liEachWidth;
          if (eachImageIndex < protectededFirst || eachImageIndex > protectededLast) {
            //保存数据
            options.cache[eachImageIndex] = currentLiList.eq(i).find('img').attr('src');
            currentLiList.eq(i).remove();
          }
        }
      }

      function next() {
        if (romoteArray.length === $that.i) return;
        $that.i++;
        getArray($that.i - 1, $that.i);
        //判断要添加的图片是否不存在
        var lastImageLeft = parseInt($el.find(options.items).children('li').last().css('left'));
        var width = Math.floor(parseInt($el.parent().css('width')) / options.number);
        var lastImageIndex = lastImageLeft / width - 1;
        if ($that.i > lastImageIndex) {
          addImage(options.array, 'right', $that.i - 1);
        }
        $that.stop();
        return to($that.i);
      }

      function prev() {
        $that.i--;
        if (options.number === $that.i + 1) return;
        if (options.savenumber) {
          var firstImageLeft = parseInt($el.find(options.items).children('li').first().css('left'));
          var width = Math.floor(parseInt($el.parent().css('width')) / options.number);
          var firstImageIndex = firstImageLeft / width;
          getArray($that.i - options.number, $that.i - options.number + 1);
          //判断要添加的图片是否不存在
          if ($that.i - options.number < firstImageIndex) {
            addImage(options.array, 'left', $that.i + 1);
          }
        }
        $that.stop();
        return to($that.i);
      }

      function to(index, callback) {
        if ($that.t) {
          stop();
          play();
        }
        var o = options,
          el = $el,
          ul = $ul,
          li = $li,
          current = $that.i,
          target = romoteArray[index];
        //  slider到达边缘条件
        if ((romoteArray.length + 1 === $that.i) && options.loop === false) {
          $that.i = index;
          return;
        }
        if (index < options.number && options.loop === false) {
          $that.i = options.number;
          return;
        }

        var speed = callback ? 5 : options.speed | 0,
          easing = options.easing,
          obj = {};

        if (!ul.queue('fx').length) {
          el.animate(obj, speed, easing) && ul.animate($.extend({
            left: (options.number - index) * Math.floor(parseInt(el.parent().css('width')) / options.number) * options.number / options.number
          }, obj), speed, easing, function (data) {
            $that.maxI = (index > $that.maxI) ? index : $that.maxI;
          });
        }
      }
    });
  };
})(jQuery);
$(function () {
  romoteArray = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
  $('.slider').slider({
    number: 3, //图数量
    savenumber: 3, //显示前后保存的数据
    autochange: true, //是否自动适应平铺
    autoplay: false, //自动播放
    arrows: true, //有箭头
    duration: 3000, //自动播放时延迟
    speed: 200, //箭头滚动速度
    autospeed: 'slow', //自动播放速度
    lazyload: true, //是否开启lazyload
    loading: 'loading.gif', //加载中的图片
    fadeIn: true //开启fadeIn滚动特效
  });
});