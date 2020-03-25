$(function () {
  $('.hidden_btn').on('click', function () {
    $('.hidden_image').fadeIn(5000);
  })
})

$(function () {
  $('.follows').on('click', function () {
    $('')
  })
})






/*global jQuery */
/*!
* Lettering.JS 0.7.0
*
* Copyright 2010, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Thanks to Paul Irish - http://paulirish.com - for the feedback.
*
* Date: Mon Sep 20 17:14:00 2010 -0600
*/
$(function () {
  function injector(t, splitter, klass, after) {
    var text = t.text()
      , a = text.split(splitter)
      , inject = '';
    if (a.length) {
      $(a).each(function (i, item) {
        inject += '<span class="' + klass + (i + 1) + '" aria-hidden="true">' + item + '</span>' + after;
      });
      t.attr('aria-label', text)
        .empty()
        .append(inject)

    }
  }


  var methods = {
    init: function () {

      return this.each(function () {
        injector($(this), '', 'char', '');
      });

    },

    words: function () {

      return this.each(function () {
        injector($(this), ' ', 'word', ' ');
      });

    },

    lines: function () {

      return this.each(function () {
        var r = "eefec303079ad17405c889e092e105b0";
        // Because it's hard to split a <br/> tag consistently across browsers,
        // (*ahem* IE *ahem*), we replace all <br/> instances with an md5 hash
        // (of the word "split").  If you're trying to use this plugin on that
        // md5 hash string, it will fail because you're being ridiculous.
        injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
      });

    }
  };

  $.fn.lettering = function (method) {
    // Method calling logic
    if (method && methods[method]) {
      return methods[method].apply(this, [].slice.call(arguments, 1));
    } else if (method === 'letters' || !method) {
      return methods.init.apply(this, [].slice.call(arguments, 0)); // always pass an array
    }
    $.error('Method ' + method + ' does not exist on jQuery.lettering');
    return this;
  };

});

/*
* textillate.js
* http://jschr.github.com/textillate
* MIT licensed
*
* Copyright (C) 2012-2013 Jordan Schroter
*/

(function ($) {
  "use strict";

  function isInEffect(effect) {
    return /In/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.inEffects) >= 0;
  };

  function isOutEffect(effect) {
    return /Out/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.outEffects) >= 0;
  };


  function stringToBoolean(str) {
    if (str !== "true" && str !== "false") return str;
    return (str === "true");
  };

  // custom get data api method
  function getData(node) {
    var attrs = node.attributes || []
      , data = {};

    if (!attrs.length) return data;

    $.each(attrs, function (i, attr) {
      var nodeName = attr.nodeName.replace(/delayscale/, 'delayScale');
      if (/^data-in-*/.test(nodeName)) {
        data.in = data.in || {};
        data.in[nodeName.replace(/data-in-/, '')] = stringToBoolean(attr.nodeValue);
      } else if (/^data-out-*/.test(nodeName)) {
        data.out = data.out || {};
        data.out[nodeName.replace(/data-out-/, '')] = stringToBoolean(attr.nodeValue);
      } else if (/^data-*/.test(nodeName)) {
        data[nodeName.replace(/data-/, '')] = stringToBoolean(attr.nodeValue);
      }
    })

    return data;
  }

  function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  function animate($t, effect, cb) {
    $t.addClass('animated ' + effect)
      .css('visibility', 'visible')
      .show();

    $t.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
      $t.removeClass('animated ' + effect);
      cb && cb();
    });
  }

  function animateTokens($tokens, options, cb) {
    var that = this
      , count = $tokens.length;

    if (!count) {
      cb && cb();
      return;
    }

    if (options.shuffle) $tokens = shuffle($tokens);
    if (options.reverse) $tokens = $tokens.toArray().reverse();

    $.each($tokens, function (i, t) {
      var $token = $(t);

      function complete() {
        if (isInEffect(options.effect)) {
          $token.css('visibility', 'visible');
        } else if (isOutEffect(options.effect)) {
          $token.css('visibility', 'hidden');
        }
        count -= 1;
        if (!count && cb) cb();
      }

      var delay = options.sync ? options.delay : options.delay * i * options.delayScale;

      $token.text() ?
        setTimeout(function () { animate($token, options.effect, complete) }, delay) :
        complete();
    });
  };

  var Textillate = function (element, options) {
    var base = this
      , $element = $(element);

    base.init = function () {
      base.$texts = $element.find(options.selector);

      if (!base.$texts.length) {
        base.$texts = $('<ul class="texts"><li>' + $element.html() + '</li></ul>');
        $element.html(base.$texts);
      }

      base.$texts.hide();

      base.$current = $('<span>')
        .html(base.$texts.find(':first-child').html())
        .prependTo($element);

      if (isInEffect(options.in.effect)) {
        base.$current.css('visibility', 'hidden');
      } else if (isOutEffect(options.out.effect)) {
        base.$current.css('visibility', 'visible');
      }

      base.setOptions(options);

      base.timeoutRun = null;

      setTimeout(function () {
        base.options.autoStart && base.start();
      }, base.options.initialDelay)
    };

    base.setOptions = function (options) {
      base.options = options;
    };

    base.triggerEvent = function (name) {
      var e = $.Event(name + '.tlt');
      $element.trigger(e, base);
      return e;
    };

    base.in = function (index, cb) {
      index = index || 0;

      var $elem = base.$texts.find(':nth-child(' + ((index || 0) + 1) + ')')
        , options = $.extend(true, {}, base.options, $elem.length ? getData($elem[0]) : {})
        , $tokens;

      $elem.addClass('current');

      base.triggerEvent('inAnimationBegin');
      $element.attr('data-active', $elem.data('id'));

      base.$current
        .html($elem.html())
        .lettering('words');

      // split words to individual characters if token type is set to 'char'
      if (base.options.type == "char") {
        base.$current.find('[class^="word"]')
          .css({
            'display': 'inline-block',
            // fix for poor ios performance
            '-webkit-transform': 'translate3d(0,0,0)',
            '-moz-transform': 'translate3d(0,0,0)',
            '-o-transform': 'translate3d(0,0,0)',
            'transform': 'translate3d(0,0,0)'
          })
          .each(function () { $(this).lettering() });
      }

      $tokens = base.$current
        .find('[class^="' + base.options.type + '"]')
        .css('display', 'inline-block');

      if (isInEffect(options.in.effect)) {
        $tokens.css('visibility', 'hidden');
      } else if (isOutEffect(options.in.effect)) {
        $tokens.css('visibility', 'visible');
      }

      base.currentIndex = index;

      animateTokens($tokens, options.in, function () {
        base.triggerEvent('inAnimationEnd');
        if (options.in.callback) options.in.callback();
        if (cb) cb(base);
      });
    };

    base.out = function (cb) {
      var $elem = base.$texts.find(':nth-child(' + ((base.currentIndex || 0) + 1) + ')')
        , $tokens = base.$current.find('[class^="' + base.options.type + '"]')
        , options = $.extend(true, {}, base.options, $elem.length ? getData($elem[0]) : {})

      base.triggerEvent('outAnimationBegin');

      animateTokens($tokens, options.out, function () {
        $elem.removeClass('current');
        base.triggerEvent('outAnimationEnd');
        $element.removeAttr('data-active');
        if (options.out.callback) options.out.callback();
        if (cb) cb(base);
      });
    };

    base.start = function (index) {
      setTimeout(function () {
        base.triggerEvent('start');

        (function run(index) {
          base.in(index, function () {
            var length = base.$texts.children().length;

            index += 1;

            if (!base.options.loop && index >= length) {
              if (base.options.callback) base.options.callback();
              base.triggerEvent('end');
            } else {
              index = index % length;

              base.timeoutRun = setTimeout(function () {
                base.out(function () {
                  run(index)
                });
              }, base.options.minDisplayTime);
            }
          });
        }(index || 0));
      }, base.options.initialDelay);
    };

    base.stop = function () {
      if (base.timeoutRun) {
        clearInterval(base.timeoutRun);
        base.timeoutRun = null;
      }
    };

    base.init();
  }

  $.fn.textillate = function (settings, args) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('textillate')
        , options = $.extend(true, {}, $.fn.textillate.defaults, getData(this), typeof settings == 'object' && settings);

      if (!data) {
        $this.data('textillate', (data = new Textillate(this, options)));
      } else if (typeof settings == 'string') {
        data[settings].apply(data, [].concat(args));
      } else {
        data.setOptions.call(data, options);
      }
    })
  };

  $.fn.textillate.defaults = {
    selector: '.texts',
    loop: false,
    minDisplayTime: 2000,
    initialDelay: 0,
    in: {
      effect: 'fadeInLeftBig',
      delayScale: 1.5,
      delay: 50,
      sync: false,
      reverse: false,
      shuffle: false,
      callback: function () { }
    },
    out: {
      effect: 'hinge',
      delayScale: 1.5,
      delay: 50,
      sync: false,
      reverse: false,
      shuffle: false,
      callback: function () { }
    },
    autoStart: true,
    inEffects: [],
    outEffects: ['hinge'],
    callback: function () { },
    type: 'char'
  };

}(jQuery));

/*  Snowfall jquery plugin
    ====================================================================
    LICENSE
    ====================================================================
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
       Unless required by applicable law or agreed to in writing, software
       distributed under the License is distributed on an "AS IS" BASIS,
       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       See the License for the specific language governing permissions and
       limitations under the License.
    ====================================================================
    Version 1.51 Dec 2nd 2012
    // fixed bug where snow collection didn't happen if a valid doctype was declared.
    Version 1.5 Oct 5th 2011
    Added collecting snow! Uses the canvas element to collect snow. In order to initialize snow collection use the following
    $(document).snowfall({collection : 'element'});
    element = any valid jquery selector.
    The plugin then creates a canvas above every element that matches the selector, and collects the snow. If there are a varrying amount of elements the
    flakes get assigned a random one on start they will collide.
    Version 1.4 Dec 8th 2010
    Fixed issues (I hope) with scroll bars flickering due to snow going over the edge of the screen.
    Added round snowflakes via css, will not work for any version of IE. - Thanks to Luke Barker of http://www.infinite-eye.com/
    Added shadows as an option via css again will not work with IE. The idea behind shadows, is to show flakes on lighter colored web sites - Thanks Yutt
    Version 1.3.1 Nov 25th 2010
    Updated script that caused flakes not to show at all if plugin was initialized with no options, also added the fixes that Han Bongers suggested
    Developed by Jason Brown for any bugs or questions email me at loktar69@hotmail
    info on the plugin is located on Somethinghitme.com
    values for snow options are
    flakeCount,
    flakeColor,
    flakeIndex,
    minSize,
    maxSize,
    minSpeed,
    maxSpeed,
    round,      true or false, makes the snowflakes rounded if the browser supports it.
    shadow      true or false, gives the snowflakes a shadow if the browser supports it.
    Example Usage :
    $(document).snowfall({flakeCount : 100, maxSpeed : 10});
    -or-
    $('#element').snowfall({flakeCount : 800, maxSpeed : 5, maxSize : 5});
    -or with defaults-
    $(document).snowfall();
    - To clear -
    $('#element').snowfall('clear');
*/

// requestAnimationFrame polyfill from https://github.com/darius/requestAnimationFrame
if (!Date.now)
  Date.now = function () { return new Date().getTime(); };

(function () {
  'use strict';

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame']
      || window[vp + 'CancelRequestAnimationFrame']);
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
    || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () { callback(lastTime = nextTime); },
        nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
}());

(function ($) {
  $.snowfall = function (element, options) {
    var flakes = [],
      defaults = {
        flakeCount: 35,
        flakeColor: '#ffffff',
        flakePosition: 'absolute',
        flakeIndex: 999999,
        minSize: 1,
        maxSize: 2,
        minSpeed: 1,
        maxSpeed: 5,
        round: false,
        shadow: false,
        collection: false,
        collectionHeight: 40,
        deviceorientation: false
      },
      options = $.extend(defaults, options),
      random = function random(min, max) {
        return Math.round(min + Math.random() * (max - min));
      };

    $(element).data("snowfall", this);

    // Snow flake object
    function Flake(_x, _y, _size, _speed) {
      // Flake properties
      this.x = _x;
      this.y = _y;
      this.size = _size;
      this.speed = _speed;
      this.step = 0;
      this.stepSize = random(1, 10) / 100;

      if (options.collection) {
        this.target = canvasCollection[random(0, canvasCollection.length - 1)];
      }

      var flakeMarkup = null;

      if (options.image) {
        flakeMarkup = document.createElement("img");
        flakeMarkup.src = options.image;
      } else {
        flakeMarkup = document.createElement("div");
        $(flakeMarkup).css({ 'background': options.flakeColor });
      }

      $(flakeMarkup).attr({
        'class': 'snowfall-flakes',
      }).css({
        'width': this.size,
        'height': this.size,
        'position': options.flakePosition,
        'top': this.y,
        'left': this.x,
        'fontSize': 0,
        'zIndex': options.flakeIndex
      });

      if ($(element).get(0).tagName === $(document).get(0).tagName) {
        $('body').append($(flakeMarkup));
        element = $('body');
      } else {
        $(element).append($(flakeMarkup));
      }

      this.element = flakeMarkup;

      // Update function, used to update the snow flakes, and checks current snowflake against bounds
      this.update = function () {
        this.y += this.speed;

        if (this.y > (elHeight) - (this.size + 6)) {
          this.reset();
        }

        this.element.style.top = this.y + 'px';
        this.element.style.left = this.x + 'px';

        this.step += this.stepSize;

        if (doRatio === false) {
          this.x += Math.cos(this.step);
        } else {
          this.x += (doRatio + Math.cos(this.step));
        }

        // Pileup check
        if (options.collection) {
          if (this.x > this.target.x && this.x < this.target.width + this.target.x && this.y > this.target.y && this.y < this.target.height + this.target.y) {
            var ctx = this.target.element.getContext("2d"),
              curX = this.x - this.target.x,
              curY = this.y - this.target.y,
              colData = this.target.colData;

            if (colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] !== undefined || curY + this.speed + this.size > this.target.height) {
              if (curY + this.speed + this.size > this.target.height) {
                while (curY + this.speed + this.size > this.target.height && this.speed > 0) {
                  this.speed *= .5;
                }

                ctx.fillStyle = defaults.flakeColor;

                if (colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] == undefined) {
                  colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] = 1;
                  ctx.fillRect(curX, (curY) + this.speed + this.size, this.size, this.size);
                } else {
                  colData[parseInt(curX)][parseInt(curY + this.speed)] = 1;
                  ctx.fillRect(curX, curY + this.speed, this.size, this.size);
                }
                this.reset();
              } else {
                // flow to the sides
                this.speed = 1;
                this.stepSize = 0;

                if (parseInt(curX) + 1 < this.target.width && colData[parseInt(curX) + 1][parseInt(curY) + 1] == undefined) {
                  // go left
                  this.x++;
                } else if (parseInt(curX) - 1 > 0 && colData[parseInt(curX) - 1][parseInt(curY) + 1] == undefined) {
                  // go right
                  this.x--;
                } else {
                  //stop
                  ctx.fillStyle = defaults.flakeColor;
                  ctx.fillRect(curX, curY, this.size, this.size);
                  colData[parseInt(curX)][parseInt(curY)] = 1;
                  this.reset();
                }
              }
            }
          }
        }

        if (this.x + this.size > (elWidth) - widthOffset || this.x < widthOffset) {
          this.reset();
        }
      }

      // Resets the snowflake once it reaches one of the bounds set
      this.reset = function () {
        this.y = 0;
        this.x = random(widthOffset, elWidth - widthOffset);
        this.stepSize = random(1, 10) / 100;
        this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
        this.speed = random(options.minSpeed, options.maxSpeed);
      }
    }

    // local vars
    var i = 0,
      elHeight = $(element).height(),
      elWidth = $(element).width(),
      widthOffset = 0,
      snowTimeout = 0;

    // Collection Piece ******************************
    if (options.collection !== false) {
      var testElem = document.createElement('canvas');
      if (!!(testElem.getContext && testElem.getContext('2d'))) {
        var canvasCollection = [],
          elements = $(options.collection),
          collectionHeight = options.collectionHeight;

        for (var i = 0; i < elements.length; i++) {
          var bounds = elements[i].getBoundingClientRect(),
            $canvas = $('<canvas/>',
              {
                'class': 'snowfall-canvas'
              }),
            collisionData = [];

          if (bounds.top - collectionHeight > 0) {
            $('body').append($canvas);

            $canvas.css({
              'position': options.flakePosition,
              'left': bounds.left + 'px',
              'top': bounds.top - collectionHeight + 'px'
            })
              .prop({
                width: bounds.width,
                height: collectionHeight
              });

            for (var w = 0; w < bounds.width; w++) {
              collisionData[w] = [];
            }

            canvasCollection.push({
              element: $canvas.get(0),
              x: bounds.left,
              y: bounds.top - collectionHeight,
              width: bounds.width,
              height: collectionHeight,
              colData: collisionData
            });
          }
        }
      } else {
        // Canvas element isnt supported
        options.collection = false;
      }
    }
    // ************************************************

    // This will reduce the horizontal scroll bar from displaying, when the effect is applied to the whole page
    if ($(element).get(0).tagName === $(document).get(0).tagName) {
      widthOffset = 25;
    }

    // Bind the window resize event so we can get the innerHeight again
    $(window).bind("resize", function () {
      elHeight = $(element)[0].clientHeight;
      elWidth = $(element)[0].offsetWidth;
    });


    // initialize the flakes
    for (i = 0; i < options.flakeCount; i += 1) {
      flakes.push(new Flake(random(widthOffset, elWidth - widthOffset), random(0, elHeight), random((options.minSize * 100), (options.maxSize * 100)) / 100, random(options.minSpeed, options.maxSpeed)));
    }

    // This adds the style to make the snowflakes round via border radius property
    if (options.round) {
      $('.snowfall-flakes').css({ '-moz-border-radius': options.maxSize, '-webkit-border-radius': options.maxSize, 'border-radius': options.maxSize });
    }

    // This adds shadows just below the snowflake so they pop a bit on lighter colored web pages
    if (options.shadow) {
      $('.snowfall-flakes').css({ '-moz-box-shadow': '1px 1px 1px #555', '-webkit-box-shadow': '1px 1px 1px #555', 'box-shadow': '1px 1px 1px #555' });
    }

    // On newer Macbooks Snowflakes will fall based on deviceorientation
    var doRatio = false;
    if (options.deviceorientation) {
      $(window).bind('deviceorientation', function (event) {
        doRatio = event.originalEvent.gamma * 0.1;
      });
    }

    // this controls flow of the updating snow
    function snow() {
      for (i = 0; i < flakes.length; i += 1) {
        flakes[i].update();
      }

      snowTimeout = requestAnimationFrame(function () { snow() });
    }

    snow();

    // clears the snowflakes
    this.clear = function () {
      $('.snowfall-canvas').remove();
      $(element).children('.snowfall-flakes').remove();
      cancelAnimationFrame(snowTimeout);
    }
  };

  // Initialize the options and the plugin
  $.fn.snowfall = function (options) {
    if (typeof (options) == "object" || options == undefined) {
      return this.each(function (i) {
        (new $.snowfall(this, options));
      });
    } else if (typeof (options) == "string") {
      return this.each(function (i) {
        var snow = $(this).data('snowfall');
        if (snow) {
          snow.clear();
        }
      });
    }
  };
})(jQuery);
