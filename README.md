EventManager
============
jQuery, NodeJS, ... eventmanager
This library is not absolutely independent on any framework

Attach event
--------
	$.EventManager.attach(string EventId, object);

	=> example

	$.EventManager.attach('test', {
		callback: function(callbackparam){
			//callback body
			console.log(callbackparam);
		},
		once: true,				//default false
		singleton: true,    	//default false
		tag: ['Tag1'],			//default []
		priority: 1000,			//default 1
		stop_propagation: false //default false
	});
	
callback: Function which is called when event is fired.

once: Callback is fired only once a then is removed.

singleton: Event listener with this function can be attached only once. Restriction against duplicate

tag: Tags for multiple removing listeners by tags.

priority: Priority of listener. We can prioritize one listener over another.

stop_propagation: Prevent from executing next listeners for this EventId.

#Back compatibility:
attach(event, callback, once = false, tag = [], priority = undefined, singleton = false)


Trigger event
--------
	$.EventManager.trigger(string EventId [, mixed callbackparam1 [, mixed callbackparam2] ... ]);

	=> example

	$.EventManager.trigger('test', {id: 'It works!'});

Advanced dynamic triggering

	function a(arg1, arg2, arg3){
		console.log(arg1 + arg2 + arg3);
	};
	$.EventManager.attach('test', a);
	$.EventManager.trigger('test', 'Hello', ' world', '!');

Detach event
--------
	$.EventManager.detachByTag(string Tag);
	$.EventManager.detachByTags(array Tags);

	=> example

	$.EventManager.detachByTag('Group1');
	$.EventManager.detachByTags(['Group1', 'Group2']);

You can detach all once triggable events with or without regex (matching EventId)

	$.EventManager.detachAllOnceByTag(string Tag);
	$.EventManager.detachAllOnceByTags(array Tag);
	$.EventManager.detachAllOnce([, RegExpression]);

	=> example

	$.EventManager.detachAllOnceByTag('Group1');
	$.EventManager.detachAllOnceByTags(['Group1', 'Group2']);
	$.EventManager.detachAllOnce();
	$.EventManager.detachAllOnce(^(.(!?Group))*$);
