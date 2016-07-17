/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Random = __webpack_require__(42);

	var _Random2 = _interopRequireDefault(_Random);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.copyPassword = copyPassword;
	window.getPassword = getPassword;
	window.savePassword = savePassword;

	var password = "";
	var masterTimeout = null;
	var copyTimeout = null;

	function copy(txt) {
	    var clipboard = document.createElement('textarea');
	    clipboard.value = txt;
	    document.body.appendChild(clipboard);
	    clipboard.select();
	    document.execCommand('cut');
	    document.body.removeChild(clipboard);
	}

	function copyPassword(txt) {
	    if (copyTimeout) {
	        window.clearTimeout(copyTimeout);
	    }
	    copy(txt);
	    copyTimeout = window.setTimeout(function () {
	        copyTimeout = null;
	        copy(_Random2.default.generateString());
	    }, 30 * 1000);
	}

	function getPassword() {
	    if (masterTimeout) {
	        window.clearTimeout(masterTimeout);
	        startTimeout();
	    }
	    return password;
	}

	function savePassword(_password) {
	    password = _password;
	    if (masterTimeout) {
	        window.clearTimeout(masterTimeout);
	    }
	    startTimeout();
	}

	function startTimeout() {
	    masterTimeout = window.setTimeout(function () {
	        var views = chrome.extension.getViews({ type: 'popup' });
	        if (views.length) {
	            window.clearTimeout(masterTimeout);
	            startTimeout();
	        } else {
	            password = "";
	            masterTimeout = null;
	        }
	    }, 90 * 1000);
	}

/***/ },

/***/ 42:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var specials = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
	var max = Math.pow(2, 32) - 1;

	var Random = function () {
	    function Random() {
	        _classCallCheck(this, Random);
	    }

	    _createClass(Random, null, [{
	        key: 'generateString',
	        value: function generateString() {
	            var length = arguments.length <= 0 || arguments[0] === undefined ? 12 : arguments[0];
	            var useSpecials = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	            var array = new Uint32Array(length);
	            window.crypto.getRandomValues(array);

	            var chars = base;
	            if (useSpecials) {
	                chars += specials;
	            }

	            var random = '';
	            array.forEach(function (num) {
	                random += chars[Math.floor(num / max * chars.length)];
	            });
	            return random;
	        }
	    }]);

	    return Random;
	}();

	exports.default = Random;

/***/ }

/******/ });