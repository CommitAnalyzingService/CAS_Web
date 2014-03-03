angular.module('cg').service('messageHandler', function(socket) {

	// A simple array remove tool preparing to be scoped when a handler is register 
	var unregister = function(callback_ptr) {
		this.splice(this.indexOf(callback_ptr), 1);
	},
	
	// Init the mH, short for messageHandler because it is used so much
	mH = {
		_handlers: {}
	};
	
	/**
	 * Register a message handler
	 * @param options Object{model, id, verb} The conditions to listen for
	 * @param callback() Function What to execute when the conditions are met from a message
	 */
	mH.register = function(options, callback) {
		
		// Traverse the model -> id -> verb tree
		// and create any node that hasn't already been created.
		if(mH._handlers.hasOwnProperty(options.model)) {
			if(mH._handlers[options.model].hasOwnProperty(options.id)) {
				if(mH._handlers[options.model][options.id].hasOwnProperty(options.verb)) {
					mH._handlers[options.model][options.id][options.verb].push(callback);
				} else {
					mH._handlers[options.model][options.id][options.verb] = [callback];
				}
			} else {
				mH._handlers[options.model][options.id] = {};
				mH._handlers[options.model][options.id][options.verb] = [callback];
			}
		} else {
			mH._handlers[options.model] = {};
			mH._handlers[options.model][options.id] = {};
			mH._handlers[options.model][options.id][options.verb] = [callback];
		}
		
		// Use the power of Function.bind to scope the unregister function in 
		// the callback queue for that verb
		callback.unregister = unregister.bind(mH._handlers[options.model][options.id][options.verb], callback);
		return callback.unregister;
	},
	
	/**
	 * Handle an incoming message from the websocket
	 * @param message Object The incoming message
	 */
	mH.handle = function(message) {
		
		// Traverse the model -> id -> verb tree and look for any handlers
		if(mH._handlers.hasOwnProperty(message.model)) {
			if(mH._handlers[message.model].hasOwnProperty(message.id)) {
				if(mH._handlers[message.model][message.id].hasOwnProperty(message.verb)) {
					var callbacks = mH._handlers[message.model][message.id][message.verb];
					// Loop through the found callbacks and execute them
					for(var i = 0, l = callbacks.length; i < l; i ++) {
						
						// If a callback returns false, stop executing the
						// other callbacks as a safety (much like events)
						if(!callbacks[i](message.data)) {
							break;
						}
					}
				}
			}
		}
		
		// Silently ignore any messages without handlers for now.
	};
	
	// Here is where we actually listen to the socket
	socket.on('message', mH.handle);
	
	// Return a simple abstraction for registering, and provide an easy way to
	// keep registration in the lifetime of a controller.
	return {
		register: mH.register,
		controllerRegister: function(scope) {
			// Keep track of the callbacks assigned
			var handler_callbacks = [];
			
			// If controller is deleted, unregister each of the callbacks
			scope.$on("$destroy", function(){
				for(var i = 0; i < handler_callbacks.length; i++) {
					handler_callbacks[i].unregister();
				}
		    });
			
			// Return a re-usable function
			return function(handler) {
				
				// Prepare the callback to be run inside a digest loop
				var handler_callback = function(data) {
					scope.$apply(function() {
						handler['callback'](data);
					});
				};
				
				// Remember the callback so it can be unregistered later
				handler_callbacks.push(handler_callback);
				
				// Register the handler and it's callback, return the
				// unregister method of the callback
				return mH.register(handler, handler_callback);
			};
		}
	};
});