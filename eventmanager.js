(function($){
	$.EventManager = function(){
		var eventmanager = this;
		var listeners = {};

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


		this.detach = function(event, item){
			listeners[event].splice(item, 1);
		};


		this.trigger = function(event, obj){
			if(typeof(listeners[event]) != 'undefined'){
				var del =
					[
					];
				for(var item in listeners[event]){
					try {
						listeners[event][item].callback(obj, event);
						if(listeners[event][item].once){
							del[del.length] = item;
						}
					}
					catch(e){
						eventmanager.trigger('EventManager:error', e);
					}
				}
				for(var d in del){
					eventmanager.detach(event, del[d]);
				}
			}
		};


		this.detachAllOnce = function(preg){
			for(var event in listeners){
				for(var o in listeners[event]){
					if(listeners[event][o].once){
						if(typeof(preg) == 'undefined'){
							eventmanager.detach(event, o);
						}
						else if(event.match(preg)){
							eventmanager.detach(event, o);
						}
					}
				}
			}
		};


		this.detachByTag = function(tag){
			for(var event in listeners){
				for(var o in listeners[event]){
					if(typeof(listeners[event][o].tag) == 'string'){
						if(listeners[event][o].tag == tag){
							eventmanager.detach(event, o);
						}
					}
					else if(typeof(listeners[event][o].tag) == 'object'){
						for(var tg in listeners[event][o].tag){
							if(listeners[event][o].tag[tg] == tag){
								eventmanager.detach(event, o);
								break;
							}
						}
					}
				}
			}
		};


		this.detachByTags = function(tags){
			for(var tag in tags){
				eventmanager.detachByTag(tags[tag]);
			}
		};


		return this;
	}();
})(jQuery);