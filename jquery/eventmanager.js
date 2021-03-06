/**
 * jQuery EventManager
 * @author Martin Lonsky (visitek@gmail.com)
 * @link https://github.com/visitek/eventmanager
 */
(function($){
	'use strict';
	var EventManager = function(){
		var eventmanager = {};
		var listeners = {};
		var debug = false;


		/**
		 * Start debugging
		 */
		eventmanager.debug = function(){
			debug = true;
		};


		/**
		 * attach
		 * @param event
		 * @param callback
		 * @param once
		 * @param tag
		 * @param priority
		 * @param stop_propagation
		 */
		eventmanager.attach = function(event, callback, once, tag, priority, stop_propagation){
			var singleton = false;
			if(typeof callback === 'object'){
				once = callback.once;
				tag = callback.tag;
				priority = callback.priority;
				stop_propagation = callback.stop_propagation;
				singleton = callback.singleton === true;
				callback = callback.callback;
			}
			if(listeners[event] === undefined){
				listeners[event] =
					[];
			}
			if(singleton === true){
				var i;
				for(i in listeners[event]){
					if(listeners[event][i].callback.toString() === callback.toString()){
						if(debug){
							console.log('singleton_skipped:' + event + '(' + callback.toString().length + ', ' + once + ', ' + priority + ')');
						}
						return;
					}
				}
			}
			var attach = {
				callback         : callback,
				once             : once !== undefined ? once : false,
				tag              : tag !== undefined ? tag : false,
				priority         : priority !== undefined ? priority : 0,
				stop_propagation : stop_propagation !== undefined ? stop_propagation : false
			};
			listeners[event][listeners[event].length] = attach;
			listeners[event].sort(function(a, b){
				return b.priority - a.priority;
			});
			if(debug){
				console.log('%c attached:' + event + ' ', 'background: #222; color: #bada55');
				console.log(attach);
			}
		};


		/**
		 * detach
		 * @param event
		 * @param item
		 */
		var detachEvent = function(event, item){
			listeners[event].splice(item, 1);
			if(debug){
				console.log('detached:' + event);
			}
		};


		/**
		 * Trigger event
		 * @param event
		 */
		eventmanager.trigger = function(event){
			if(listeners[event] !== undefined){
				if(debug){
					console.log('%c trigger:' + event + ' ', 'color: #E11B22');
				}
				var detach =
					[];
				var stoppped = false;
				var item, args, arg;
				for(item in listeners[event]){
					try {
						args =
							[];
						for(arg in arguments){
							if(arg === '0'){
								continue;
							}
							args[args.length] = arguments[arg];
						}
						if(!stoppped){
							if(debug){
								console.log('%c triggered:' + event + ' ', 'background: #222; color: #FCCA7C');
								console.log(listeners[event][item]);
							}
							try {
								listeners[event][item].callback.apply(undefined, args);
							}
							catch(e){
								$.Errors.throwError(e);
							}
						}
						else {
							if(debug){
								console.log('stopped:' + event + '(' + listeners[event][item].callback.toString().length + ')');
							}
						}
						if(listeners[event][item].once){
							detach[detach.length] = item;
						}
						if(listeners[event][item].stop_propagation){
							stoppped = true;
						}
					}
					catch(e){
						eventmanager.trigger('EventManager:error', {err : e, event : event});
					}
				}
				detach = detach.reverse();
				var i;
				for(i in detach){
					detachEvent(event, detach[i]);
				}
				if(listeners[event].length === 0){
					delete(listeners[event]);
				}
			}
			else {
				if(debug){
					console.log('no-listener:' + event);
				}
			}
		};

		/**
		 * Detach all once triggable events
		 * @param preg
		 */
		eventmanager.detachAllOnce = function(preg){
			var detach, event, o, i;
			for(event in listeners){
				detach =
					[];
				for(o in listeners[event]){
					if(listeners[event][o].once){
						if(preg === undefined){
							detach[detach.length] = o;
						}
						else if((new RegExp(preg)).test(event)){
							detach[detach.length] = o;
						}
					}
				}
				detach = detach.reverse();
				for(i in detach){
					detachEvent(event, detach[i]);
				}
			}
		};


		/**
		 * Detach all once triggable events by tag
		 * @param tag
		 */
		eventmanager.detachAllOnceByTag = function(tag){
			var event, detach, o, tg, i;
			for(event in listeners){
				detach =
					[];
				for(o in listeners[event]){
					if(listeners[event][o].once){
						if(typeof(listeners[event][o].tag) === 'string'){
							if(listeners[event][o].tag === tag){
								detach[detach.length] = o;
							}
						}
						else if(typeof(listeners[event][o].tag) === 'object'){
							for(tg in listeners[event][o].tag){
								if(listeners[event][o].tag[tg] === tag){
									detach[detach.length] = o;
									break;
								}
							}
						}
					}
				}
				detach = detach.reverse();
				for(i in detach){
					detachEvent(event, detach[i]);
				}
			}
		};


		/**
		 * Detach all once triggable events by tags
		 * @param tags
		 */
		eventmanager.detachAllOnceByTags = function(tags){
			var tag;
			for(tag in tags){
				eventmanager.detachAllOnceByTag(tags[tag]);
			}
		};


		/**
		 * Detach by tag
		 * @param tag
		 */
		eventmanager.detachByTag = function(tag){
			var event, detach, o, tg, i;
			for(event in listeners){
				detach =
					[];
				for(o in listeners[event]){
					if(typeof(listeners[event][o].tag) === 'string'){
						if(listeners[event][o].tag === tag){
							detach[detach.length] = o;
						}
					}
					else if(typeof(listeners[event][o].tag) === 'object'){
						for(tg in listeners[event][o].tag){
							if(listeners[event][o].tag[tg] === tag){
								detach[detach.length] = o;
								break;
							}
						}
					}
				}
				detach = detach.reverse();
				for(i in detach){
					detachEvent(event, detach[i]);
				}
			}
		};


		/**
		 * Detach by tags
		 * @param tags
		 */
		eventmanager.detachByTags = function(tags){
			var tag;
			for(tag in tags){
				eventmanager.detachByTag(tags[tag]);
			}
		};


		/**
		 * Get new eventmanager
		 * @returns {EventManager}
		 */
		eventmanager.clone = function(){
			return new EventManager();
		};


		return eventmanager;
	};
	$.EventManager = new EventManager();
}(jQuery));