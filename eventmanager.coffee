(($) ->
  EventManager = ->
    debug = false
    listeners = {}
    eventmanager = this


    ###
    # Attach event
    # @param string    event
    # @param int       offset
    ###
    detachEvent = (event, item)->
      listeners[event].splice item, 1
      if listeners[event].length == 0
        delete listeners[event]
      if debug
        console.log 'detached:' + event
      return true


    ###
    # Attach event
    # @param string          event
    # @param callable|object callback
    ###
    @attach = (event, callback)->
      singleton = false
      tag = [event]
      if typeof callback == 'object'
        once = callback.once;
        if callback.tag
          tag = tag.push callback.tag;
        priority = callback.priority;
        stop_propagation = callback.stop_propagation;
        singleton = if callback.singleton then callback.singleton else false;
        callback = callback.callback;
      if listeners[event] == undefined
        listeners[event] = [];
      if singleton
        for l_key, listener of listeners[event]
          if listener.callback.toString() == callback.toString()
            if debug
              console.log 'singleton_skipped:' + event + '(' + callback.toString().length + ', ' + once + ', ' + priority + ')'
            return false
      attach =
        callback        : callback
        once            : if once then once else false
        tag             : if tag then tag else false
        priority        : if priority then priority else 0
        stop_propagation: if stop_propagation then stop_propagation else false
      listeners[event].push attach
      listeners[event].sort (a, b)->
        return b.priority - a.priority
      if debug
        console.log '%c attached:' + event + ' ', 'background: #222; color: #bada55'
        console.log attach
      return true


    ###
    # Trigger event
    # @param string event
    ###
    @trigger = (event)->
      if listeners[event]
        if debug
          console.log '%c trigger:' + event + ' ', 'color: #E11B22'
        detach = []
        stopped = false
        for l_key, listener of listeners[event]
          try
            args =
              for key, arg of arguments when key != '0'
                arg
            if !stopped
              if(debug)
                console.log '%c triggered:' + event + ' ', 'background: #222; color: #FCCA7C'
                console.log listener
              listener.callback.apply undefined, args
            else
              if debug
                console.log 'stopped:' + event + '(' + listener.callback.toString().length + ')'
            if listener.once
              detach[detach.length] = l_key
            if listener.stop_propagation
              stopped = true
          catch e
            if $.Errors && $.Errors.throwError
              $.Errors.throwError e
            eventmanager.trigger 'EventManager:error',
              err  : e
              event: event
        detach = detach.reverse()
        detachEvent event, i for i in detach
      else
        if debug
          console.log 'no-listener:' + event
      return


    ###
    # Detach all once listeners
    # @param string preg
    ###
    @detachAllOnce = (preg)->
      for event, events of listeners
        detach = []
        for o, listener of events when listener.once
          if preg == undefined
            detach.push o
          else if (new RegExp(preg)).test event
            detach.push o
        detach.reverse()
        detachEvent event, i for i in detach
      return true


    ###
    # Detach all once listeners by tag
    # @param string preg
    ###
    @detachAllOnceByTag = (tag)->
      for event, events of listeners
        detach = []
        for o, listener of events when listener.once && listener.tag == tag
          detach.push o
        detach.reverse()
        detachEvent event, i for i in detach
      return true

    ###
    # Detach all once listeners by tags
    # @param string preg
    ###
    @detachAllOnceByTags = (tags)->
      eventmanager.detachAllOnceByTag tag for tag in tags
      return true


    ###
    # Detach all listeners by tag
    # @param string preg
    ###
    @detachByTag = (tag)->
      for event, events of listeners
        detach = []
        for o, listener of events when listener.tag == tag
          detach.push o
        detach.reverse()
        detachEvent event, i for i in detach
      return true


    ###
    # Detach all listeners by tags
    # @param string preg
    ###
    @detachByTags = (tags)->
      eventmanager.detachByTag tag for tag in tags
      return true


    ###
    # Debug - show messages
    ###
    @debug = ()->
      debug = true


    ###
    # Get new instance
    ###
    @clone = ()->
      new EventManager


    return this
  $.EventManager = new EventManager
  return)(jQuery)