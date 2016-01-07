// Generated by CoffeeScript 1.9.3
(function() {
  (function($) {
    var EventManager;
    EventManager = function() {
      var debug, detachEvent, eventmanager, listeners;
      debug = false;
      listeners = {};
      eventmanager = this;

      /*
       * Attach event
       * @param string    event
       * @param int       offset
       */
      detachEvent = function(event, item) {
        listeners[event].splice(item, 1);
        if (listeners[event].length === 0) {
          delete listeners[event];
        }
        if (debug) {
          console.log('detached:' + event);
        }
        return true;
      };

      /*
       * Attach event
       * @param string          event
       * @param callable|object callback
       */
      this.attach = function(event, callback, once, tag, priority, singleton) {
        var attach, i, l_key, listener, ref, ref1, stop_propagation, tg;
        if (once == null) {
          once = false;
        }
        if (tag == null) {
          tag = [];
        }
        if (priority == null) {
          priority = void 0;
        }
        if (singleton == null) {
          singleton = false;
        }
        singleton = false;
        if (typeof tag !== 'array') {
          tag = [tag];
        }
        tag.push(event);
        if (typeof callback === 'object') {
          once = callback.once;
          if (callback.tag) {
            if (typeof callback.tag === 'string') {
              tag = tag.push(callback.tag);
            } else {
              ref = callback.tag;
              for (i in ref) {
                tg = ref[i];
                tag = tag.push(tg);
              }
            }
          }
          priority = callback.priority;
          stop_propagation = callback.stop_propagation;
          singleton = callback.singleton ? callback.singleton : false;
          callback = callback.callback;
        }
        if (listeners[event] === void 0) {
          listeners[event] = [];
        }
        if (singleton) {
          ref1 = listeners[event];
          for (l_key in ref1) {
            listener = ref1[l_key];
            if (listener.callback.toString() === callback.toString()) {
              if (debug) {
                console.log('singleton_skipped:' + event + '(' + callback.toString().length + ', ' + once + ', ' + priority + ')');
              }
              return false;
            }
          }
        }
        attach = {
          callback: callback,
          once: once ? once : false,
          tag: tag ? tag : false,
          priority: priority ? priority : 0,
          stop_propagation: stop_propagation ? stop_propagation : false
        };
        listeners[event].push(attach);
        listeners[event].sort(function(a, b) {
          return b.priority - a.priority;
        });
        if (debug) {
          console.log('%c attached:' + event + ' ', 'background: #222; color: #bada55');
          console.log(attach);
        }
        return true;
      };

      /*
       * Trigger event
       * @param string event
       */
      this.trigger = function(event) {
        var arg, args, detach, e, i, j, key, l_key, len, listener, ref, stopped;
        if (listeners[event]) {
          if (debug) {
            console.log('%c trigger:' + event + ' ', 'color: #E11B22');
          }
          detach = [];
          stopped = false;
          ref = listeners[event];
          for (l_key in ref) {
            listener = ref[l_key];
            try {
              args = (function() {
                var results;
                results = [];
                for (key in arguments) {
                  arg = arguments[key];
                  if (key !== '0') {
                    results.push(arg);
                  }
                }
                return results;
              }).apply(this, arguments);
              if (!stopped) {
                if (debug) {
                  console.log('%c triggered:' + event + ' ', 'background: #222; color: #FCCA7C');
                  console.log(listener);
                }
                listener.callback.apply(void 0, args);
              } else {
                if (debug) {
                  console.log('stopped:' + event + '(' + listener.callback.toString().length + ')');
                }
              }
              if (listener.once) {
                detach[detach.length] = l_key;
              }
              if (listener.stop_propagation) {
                stopped = true;
              }
            } catch (_error) {
              e = _error;
              if ($.Errors && $.Errors.throwError) {
                $.Errors.throwError(e);
              }
              eventmanager.trigger('EventManager:error', {
                err: e,
                event: event
              });
            }
          }
          detach = detach.reverse();
          for (j = 0, len = detach.length; j < len; j++) {
            i = detach[j];
            detachEvent(event, i);
          }
        } else {
          if (debug) {
            console.log('no-listener:' + event);
          }
        }
      };

      /*
       * Detach all once listeners
       * @param string preg
       */
      this.detachAllOnce = function(preg) {
        var detach, event, events, i, j, len, listener, o;
        for (event in listeners) {
          events = listeners[event];
          detach = [];
          for (o in events) {
            listener = events[o];
            if (listener.once) {
              if (preg === void 0) {
                detach.push(o);
              } else if ((new RegExp(preg)).test(event)) {
                detach.push(o);
              }
            }
          }
          detach.reverse();
          for (j = 0, len = detach.length; j < len; j++) {
            i = detach[j];
            detachEvent(event, i);
          }
        }
        return true;
      };

      /*
       * Detach all once listeners by tag
       * @param string preg
       */
      this.detachAllOnceByTag = function(tag) {
        var detach, event, events, i, j, len, listener, o;
        for (event in listeners) {
          events = listeners[event];
          detach = [];
          for (o in events) {
            listener = events[o];
            if (listener.once && listener.tag === tag) {
              detach.push(o);
            }
          }
          detach.reverse();
          for (j = 0, len = detach.length; j < len; j++) {
            i = detach[j];
            detachEvent(event, i);
          }
        }
        return true;
      };

      /*
       * Detach all once listeners by tags
       * @param string preg
       */
      this.detachAllOnceByTags = function(tags) {
        var j, len, tag;
        for (j = 0, len = tags.length; j < len; j++) {
          tag = tags[j];
          eventmanager.detachAllOnceByTag(tag);
        }
        return true;
      };

      /*
       * Detach all listeners by tag
       * @param string preg
       */
      this.detachByTag = function(tag) {
        var detach, event, events, i, j, len, listener, o;
        for (event in listeners) {
          events = listeners[event];
          detach = [];
          for (o in events) {
            listener = events[o];
            if (listener.tag === tag) {
              detach.push(o);
            }
          }
          detach.reverse();
          for (j = 0, len = detach.length; j < len; j++) {
            i = detach[j];
            detachEvent(event, i);
          }
        }
        return true;
      };

      /*
       * Detach all listeners by tags
       * @param string preg
       */
      this.detachByTags = function(tags) {
        var j, len, tag;
        for (j = 0, len = tags.length; j < len; j++) {
          tag = tags[j];
          eventmanager.detachByTag(tag);
        }
        return true;
      };

      /*
       * Debug - show messages
       */
      this.debug = function() {
        return debug = true;
      };

      /*
       * Get new instance
       */
      this.clone = function() {
        return new EventManager;
      };
      return this;
    };
    $.EventManager = new EventManager;
  })(jQuery);

}).call(this);

//# sourceMappingURL=eventmanager.js.map
