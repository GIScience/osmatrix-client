var EventEmitter = (function() {
		
	/**
	 * Constructor
	 */
	function eventEmitter() {
		/**
		 * [events description]
		 * @type {Object}
		 */
		this.events = {};
	}

	/**
	 * [register description]
	 * @param  {Function} callback [description]
	 */
	function register(ev, callback) {
		if (!this.events[ev]) this.events[ev] = [];
		this.events[ev].push(callback);
	}

	/**
	 * [emit description]
	 * @param  {String} event [description]
	 */
	function emit(ev) {
		if (this.events[ev]) {
			for (var i = 0; i < this.events[ev].length; i++) {
				this.events[ev][i]();
			}
		}
	}



	eventEmitter.prototype.register = register;
	eventEmitter.prototype.emit = emit;

	return eventEmitter;
})();