/**
 * jQuery EventManager
 * @author Martin Lonsky (visitek@gmail.com)
 * @link https://github.com/visitek/eventmanager
 */
var EventManager = function(){
	var eventmanager = this;
	var listeners = {};
	var debug = false;


	/**
	 * Start debugging
	 */
	this.debug = function(){
		debug = true;
	};


	/**
	 * Attach event
	 * @param string event
	 * @param function callback
	 * @param bool once
	 * @param string|array tag
	 * @param int priority
	 */
	this.attach = function(event, callback, once, tag, priority){
		if(typeof(listeners[event]) == 'undefined'){
			listeners[event] =
				[];
		}
		listeners[event][listeners[event].length] = {
			callback : callback,
			once     : typeof(once) != 'undefined' ? once : false,
			tag      : typeof(tag) != 'undefined' ? tag : false,
			priority : typeof(tag) != 'undefined' ? priority : 0
		};
		listeners[event].sort(function(a, b){
			return b.priority - a.priority;
		});
		if(debug){
			console.log('attached:' + event + '(' + once + ', ' + priority + ')');
		}
	};


	/**
	 * detach
	 * @param string event
	 * @param offset item
	 */
	var _detach = function(event, item){
		listeners[event].splice(item, 1);
		if(debug){
			console.log('detached:' + event);
		}
	};


	/**
	 * Trigger event
	 * @param string event
	 */
	this.trigger = function(event){
		if(typeof(listeners[event]) != 'undefined'){
			var detach =
				[];
			for(var item in listeners[event]){
				try {
					var args =
						[];
					for(var arg in arguments){
						if(arg == 0){
							continue;
						}
						args[args.length] = arguments[arg];
					}
					listeners[event][item].callback.apply(undefined, args);
					if(debug){
						console.log('triggered:' + event);
					}
					if(listeners[event][item].once){
						detach[detach.length] = item;
					}
				}
				catch(e){
					eventmanager.trigger('EventManager:error', {err : e, event : event});
				}
			}
			detach = detach.reverse();
			for(var i in detach){
				_detach(event, detach[i]);
			}
			if(listeners[event].length == 0){
				delete(listeners[event]);
			}
		}
	};

	/**
	 * Detach all once triggable events
	 * @param mixed preg Reg expression
	 */
	this.detachAllOnce = function(preg){
		eventsdel =
			[];
		for(var event in listeners){
			var detach =
				[];
			for(var o in listeners[event]){
				if(listeners[event][o].once){
					if(typeof(preg) == 'undefined'){
						detach[detach.length] = o;
					}
					else if((new RegExp(preg)).test(event)){
						detach[detach.length] = o;
					}
				}
			}
			detach = detach.reverse();
			for(var i in detach){
				_detach(event, detach[i]);
			}
			if(listeners[event].length == 0){
				eventsdel[eventsdel.length] = event;
			}
		}
		for(var e in eventsdel){
			delete(eventsdel[e]);
		}
	};


	/**
	 * Detach all once triggable events by tag
	 * @param string tag
	 */
	this.detachAllOnceByTag = function(tag){
		eventsdel =
			[];
		for(var event in listeners){
			var detach =
				[];
			for(var o in listeners[event]){
				if(listeners[event][o].once){
					if(typeof(listeners[event][o].tag) == 'string'){
						if(listeners[event][o].tag == tag){
							detach[detach.length] = o;
						}
					}
					else if(typeof(listeners[event][o].tag) == 'object'){
						for(var tg in listeners[event][o].tag){
							if(listeners[event][o].tag[tg] == tag){
								detach[detach.length] = o;
								break;
							}
						}
					}
				}
			}
			detach = detach.reverse();
			for(var i in detach){
				_detach(event, detach[i]);
			}
			if(listeners[event].length == 0){
				eventsdel[eventsdel.length] = event;
			}
		}
		for(var e in eventsdel){
			delete(eventsdel[e]);
		}
	};


	/**
	 * Detach all once triggable events by tags
	 * @param array tags
	 */
	this.detachAllOnceByTags = function(tags){
		for(var tag in tags){
			eventmanager.detachAllOnceByTag(tags[tag]);
		}
	};


	/**
	 * Detach by tag
	 * @param string tag
	 */
	this.detachByTag = function(tag){
		eventsdel =
			[];
		for(var event in listeners){
			var detach =
				[];
			for(var o in listeners[event]){
				if(typeof(listeners[event][o].tag) == 'string'){
					if(listeners[event][o].tag == tag){
						detach[detach.length] = o;
					}
				}
				else if(typeof(listeners[event][o].tag) == 'object'){
					for(var tg in listeners[event][o].tag){
						if(listeners[event][o].tag[tg] == tag){
							detach[detach.length] = o;
							break;
						}
					}
				}
			}
			detach = detach.reverse();
			for(var i in detach){
				_detach(event, detach[i]);
			}
			if(listeners[event].length == 0){
				eventsdel[eventsdel.length] = event;
			}
		}
		for(var e in eventsdel){
			delete(eventsdel[e]);
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
};
module.exports = EventManager;