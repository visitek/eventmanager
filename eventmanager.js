/**
 * jQuery EventManager
 * @author Martin Lonsky (visitek@gmail.com)
 * @link https://github.com/visitek/eventmanager
 */
(function($){
	/**
	 * Event manager object
	 */
	$.EventManager = function(){
		var eventmanager = this;
		var listeners = {};

		/**
		 * Attach event
		 * @param string event
		 * @param function callback
		 * @param bool once
		 * @param string|array tag
		 */
		this.attach = function(event, callback, once, tag){
			if(typeof(listeners[event]) == 'undefined'){
				listeners[event] =
					[
					];
			}
			listeners[event][listeners[event].length] = {
				callback : callback,
				once     : typeof(once) != 'undefined' ? once : false,
				tag      : typeof(tag) != 'undefined' ? tag : false
			};
		};


		/**
		 * detach
		 * @param string event
		 * @param offset item
		 */
		var _detach = function(event, item){
			listeners[event].splice(item, 1);
			if(listeners[event].length == 0){
				delete(listeners[event]);
			}
		};


		/**
		 * Trigger event
		 * @param string event
		 */
		this.trigger = function(event){
			if(typeof(listeners[event]) != 'undefined'){
				for(var item in listeners[event]){
					try {
						var args =
							[
							];
						for(var arg in arguments){
							if(arg == 0){
								continue;
							}
							args[args.length] = arguments[arg];
						}
						listeners[event][item].callback.apply(undefined, args);
						if(listeners[event][item].once){
							_detach(event, item);
						}
					}
					catch(e){
						eventmanager.trigger('EventManager:error', {err : e, event : event});
					}
				}
			}
		};

		/**
		 * Detach all once triggable events
		 * @param mixed preg Reg expression
		 */
		this.detachAllOnce = function(preg){
			for(var event in listeners){
				for(var o in listeners[event]){
					if(listeners[event][o].once){
						if(typeof(preg) == 'undefined'){
							_detach(event, o);
						}
						else if((new RegExp(preg)).test(event)){
							_detach(event, o);
						}
					}
				}
			}
		};


		/**
		 * Detach all once triggable events by tag
		 * @param string tag
		 */
		this.detachAllOnceByTag = function(tag){
			for(var event in listeners){
				for(var o in listeners[event]){
					if(listeners[event][o].once){
						if(typeof(listeners[event][o].tag) == 'string'){
							if(listeners[event][o].tag == tag){
								_detach(event, o);
							}
						}
						else if(typeof(listeners[event][o].tag) == 'object'){
							for(var tg in listeners[event][o].tag){
								if(listeners[event][o].tag[tg] == tag){
									_detach(event, o);
									break;
								}
							}
						}
					}
				}
			}
		};


		/**
		 * Detach all once triggable events by tags
		 * @param array tags
		 */
		this.detachAllOnceByTaga = function(tags){
			for(var tag in tags){
				eventmanager.detachAllOnceByTag(tags[tag]);
			}
		};


		/**
		 * Detach by tag
		 * @param string tag
		 */
		this.detachByTag = function(tag){
			for(var event in listeners){
				for(var o in listeners[event]){
					if(typeof(listeners[event][o].tag) == 'string'){
						if(listeners[event][o].tag == tag){
							_detach(event, o);
						}
					}
					else if(typeof(listeners[event][o].tag) == 'object'){
						for(var tg in listeners[event][o].tag){
							if(listeners[event][o].tag[tg] == tag){
								_detach(event, o);
								break;
							}
						}
					}
				}
			}
		};


		/**
		 * Detach by tags
		 * @param array tags
		 */
		this.detachByTags = function(tags){
			for(var tag in tags){
				eventmanager.detachByTag(tags[tag]);
			}
		};


		return this;
	}();
})(jQuery);