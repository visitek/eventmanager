jQuery EventManager
============
jQuery eventmanager plugin

Attach event
--------
	$.EventManager.attach(string EventId, function Callback [, bool OlnlyOnce [, string|array Tags]]);
	=>
	$.EventManager.attach('test', function(callbackparam){
		//callback body
		console.log(callbackparam.id);
	}, false, ['Group1', 'Group2']);

Trigger event
--------
	$.EventManager.trigger(string EventId [, mixed callbackparam]);
	=>
	$.EventManager.trigger('test', {id: 'It works!'});

Detach event
--------
	$.EventManager.detachByTag(string Tag);
	$.EventManager.detachByTags(array Tags);
	=>
	$.EventManager.detachByTag('Group1');
	$.EventManager.detachByTags(['Group1', 'Group2']);

You can detach all once triggable events with or without regex (matching EventId)

	$.EventManager.detachAllOnce();
	$.EventManager.detachAllOnce(^(.(!?Group))*$);