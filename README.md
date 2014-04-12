jQuery EventManager
============
jQuery eventmanager plugin

Attach event
--------
	$.EventManager.attach(string EventId, function Callback [, bool OnlyOnce [, string|array Tag]]);

	=> example

	$.EventManager.attach('test', function(callbackparam){
		//callback body
		console.log(callbackparam.id);
	}, false, ['Group1', 'Group2']);

Next attached event will be triggered only once and then will be detached automatically

	$.EventManager.attach('test', function(){
    	//callback body
    }, true);

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
	$.EventManager.detachAllOnce([, string RegExpression]);

	=> example

	$.EventManager.detachAllOnceByTag('Group1');
	$.EventManager.detachAllOnceByTags(['Group1', 'Group2']);
	$.EventManager.detachAllOnce();
	$.EventManager.detachAllOnce(^(.(!?Group))*$);
