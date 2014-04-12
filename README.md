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

Trigger event
--------
	$.EventManager.trigger(string EventId [, mixed callbackparam]);

	=> example

	$.EventManager.trigger('test', {id: 'It works!'});

Detach event
--------
	$.EventManager.detachByTag(string Tag);
	$.EventManager.detachByTags(array Tags);

	=> example

	$.EventManager.detachByTag('Group1');
	$.EventManager.detachByTags(['Group1', 'Group2']);

You can detach all once triggable events with or without regex (matching EventId)

	$.EventManager.detachAllOnceByTag(string|array Tag);
	$.EventManager.detachAllOnce([, string RegExpression]);

	=> example

	$.EventManager.detachAllOnceByTag('Group1');
	$.EventManager.detachAllOnce();
	$.EventManager.detachAllOnce(^(.(!?Group))*$);
