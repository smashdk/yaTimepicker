/*!
 * Pikaday jQuery plugin.
 *
 * Copyright © 2013 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

(function (root, factory) {
    'use strict';

    var moment;
    if (typeof exports === 'object') {
        // CommonJS module
        // Load moment.js as an optional dependency
        try { moment = require('moment'); } catch (e) { }
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function (req) {
            // Load moment.js as an optional dependency
            var id = 'moment';
            moment = req.defined && req.defined(id) ? req(id) : undefined;
            return factory(moment);
        });
    } else {
        root.YaTimePicker = factory(root.moment);
    }
}(this, function (moment) {
  'use strict';

    var yaHourMinuteSelected = function (e) {
      e.data.timeDropCtrl.hide();
      e.data.timeDropInputCtrl.attr('value', $(this).attr('value'));
    }

    var yaHourSelected = function (e) {
      var hour = $(this).attr('value');
      var format = (e.data.settings.alwaysUse24Hours) ? 'HH:mm' : 'LT';
      var testHour = moment().locale(e.data.settings.locale).hour(10).minute(0).format(format)
      var actualHour = moment().locale(e.data.settings.locale).hour(hour).minute(0).format(format)
      e.data.timeDropUlCtrl.empty();
      e.data.timeDropInputCtrl.attr('value', (actualHour.length < testHour.length) ? '0' + actualHour : actualHour);
      for (var i = 0; i < 60 ; i += 5) {
        var listHourMinute = $('<li>');
        var hourMinute = moment().locale(e.data.settings.locale).hour(hour).minute(i).format(format);
        var hourMinuteLink = $('<a>' + ((hourMinute.length < testHour.length) ? '0' + hourMinute : hourMinute) + '</a>');
        hourMinuteLink.attr('value', '' + ((hourMinute.length < testHour.length) ? '0' + hourMinute : hourMinute));
        hourMinuteLink.click({ timeDropInputCtrl: e.data.timeDropInputCtrl, timeDropCtrl: e.data.timeDropCtrl, }, yaHourMinuteSelected);
        hourMinuteLink.appendTo(listHourMinute);

        e.data.timeDropUlCtrl.append(listHourMinute);
      }
      e.stopPropagation();
    }

    $.fn.yaTimepicker = function (options) {
      var settings = $.extend({
        locale: 'en',
        alwaysUse24Hours: false,
      }, options);

      return this.each(function () {
        var timeDrop = $('<div class="yatimedrop"/>');
        var timeDropUl = $('<ul/>');
        timeDropUl.appendTo(timeDrop);
        $(this).addClass("yatimeinput");
        $(this).after(timeDrop);
        $(this).click(function (event) {
          var d2 = $(this);

          timeDropUl.empty();
          var format = (settings.alwaysUse24Hours) ? 'HH:mm' : 'LT';
          var testHour = moment().locale(settings.locale).hour(10).minute(0).format(format)
          for (var i = 0; i < 24; i++) {
            var listHour = $('<li>');
            var hourFormat = moment().locale(settings.locale).hour(i).minute(0).format(format);
            var hour = $('<a>' + ((testHour.length > hourFormat.length) ? '0' + hourFormat : hourFormat) + "</a>");
            hour.attr('value', '' + i);
            hour.click({ timeDropUlCtrl: timeDropUl, timeDropInputCtrl: $(this), timeDropCtrl: timeDrop, settings: settings }, yaHourSelected);
            hour.appendTo(listHour);

            timeDropUl.append(listHour);
          }

          timeDrop.css('top', (d2.position().top + d2.outerHeight()) + 'px');
          timeDrop.css('left', d2.position() + 'px');
          timeDrop.css('width', d2.outerWidth() + 'px');
          timeDrop.show();

          event.stopPropagation();
          $('html').one('click', function () {
            if ($(event.target).closest(timeDrop).length == 0) {
              if ($(timeDrop).is(":visible")) {
                $(timeDrop).hide()
              }
            }
          });
        });
      });
    };
}));
