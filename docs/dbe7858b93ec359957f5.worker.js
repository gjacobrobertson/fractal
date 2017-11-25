/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__constants__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__plane__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__plane___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__plane__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__escapeTime__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__escapeTime___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__escapeTime__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__color__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__color___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__color__);
/* eslint-env serviceworker */





const transform = __WEBPACK_IMPORTED_MODULE_1__plane___default()(__WEBPACK_IMPORTED_MODULE_0__constants__["width"], __WEBPACK_IMPORTED_MODULE_0__constants__["height"], 0, 0, __WEBPACK_IMPORTED_MODULE_0__constants__["width"] / __WEBPACK_IMPORTED_MODULE_0__constants__["height"] * 2.5, 2.5)

const drawJulia = (re, im, hue) => {
  const color = Object(__WEBPACK_IMPORTED_MODULE_3__color__["hsv"])(__WEBPACK_IMPORTED_MODULE_0__constants__["iterations"], hue)
  const escapeTime = Object(__WEBPACK_IMPORTED_MODULE_2__escapeTime__["julia"])(__WEBPACK_IMPORTED_MODULE_0__constants__["iterations"], re, im)
  return (x, y) => color(Object(__WEBPACK_IMPORTED_MODULE_3__color__["smooth"])(escapeTime(transform([x, y]))))
}

const draw = (options) => {
  const { buffer, range, re, im, hue } = options
  const data = new Uint32Array(buffer)

  const getPixel = drawJulia(re, im, hue)

  let offset = 0
  let x
  let y
  for (y = range.min; y < range.max; y++) {
    for (x = 0; x < __WEBPACK_IMPORTED_MODULE_0__constants__["width"]; x++) {
      const [r, g, b, a] = getPixel(x, y)
      data[offset++] =
        a << 24 |
        b << 16 |
        g << 8 |
        r
    }
  }
  return buffer
}

self.addEventListener('message', ({data}) => {
  draw(data)
  self.postMessage(data.buffer, [data.buffer])
})


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var width = exports.width = 640;
var height = exports.height = 480;
var iterations = exports.iterations = 50;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (width, height, cx, cy, zx, zy) {
  return function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    var xOffset = x / width * zx;
    var yOffset = y / height * zy;
    return [cx - zx / 2 + xOffset, cy - zy / 2 + yOffset];
  };
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var escapeTime = function escapeTime(iterations, radius, re, im) {
  return function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        cRe = _ref2[0],
        cIm = _ref2[1];

    var zRe = cRe;
    var zIm = cIm;
    var tRe = zRe * zRe;
    var tIm = zIm * zIm;
    var kIm = im != null ? im : cIm;
    var kRe = re != null ? re : cRe;
    var step = 0;
    for (step = 0; step < iterations; step++) {
      if (tRe + tIm > radius) {
        return [step, tRe, tIm];
      }
      zIm = 2 * zRe * zIm + kIm;
      zRe = tRe - tIm + kRe;
      tRe = zRe * zRe;
      tIm = zIm * zIm;
    }
    return [null, tRe, tIm];
  };
};

var mandelbrot = exports.mandelbrot = function mandelbrot(iterations) {
  return escapeTime(iterations, 4);
};
var julia = exports.julia = function julia(iterations, re, im) {
  return escapeTime(iterations, 10, re, im);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var logBase = 1.0 / Math.log(2.0);
var logHalfBase = Math.log(0.5) * logBase;

/*
 * Convert hue-saturation-value/luminosity to RGB.
 *
 * Input ranges:
 *   H =   [0, 360] (integer degrees)
 *   S = [0.0, 1.0] (float)
 *   V = [0.0, 1.0] (float)
 */
var hsvToRgb = function hsvToRgb(h, s, v) {
  if (v > 1.0) v = 1.0;
  var hp = h / 60.0;
  var c = v * s;
  var x = c * (1 - Math.abs(hp % 2 - 1));
  var rgb = [0, 0, 0];

  if (hp >= 0 && hp < 1) rgb = [c, x, 0];
  if (hp >= 1 && hp < 2) rgb = [x, c, 0];
  if (hp >= 2 && hp < 3) rgb = [0, c, x];
  if (hp >= 3 && hp < 4) rgb = [0, x, c];
  if (hp >= 4 && hp < 5) rgb = [x, 0, c];
  if (hp >= 5 && hp < 6) rgb = [c, 0, x];

  var m = v - c;
  rgb[0] += m;
  rgb[1] += m;
  rgb[2] += m;

  rgb[0] *= 255;
  rgb[1] *= 255;
  rgb[2] *= 255;
  return rgb;
};

var smooth = exports.smooth = function smooth(_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      n = _ref2[0],
      tRe = _ref2[1],
      tIm = _ref2[2];

  return n && 5 + n - logHalfBase - Math.log(Math.log(tRe + tIm)) * logBase;
};

var grayscale = exports.grayscale = function grayscale(iterations) {
  var scale = 256 / iterations;
  return function (v) {
    v = scale * v % 256;
    return [v, v, v, 255];
  };
};

var hsv = exports.hsv = function hsv(iterations) {
  var hue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var hScale = 360 / iterations;
  var vScale = 5 / iterations;
  return function (v) {
    if (!v) {
      var _rgb = hsvToRgb((hue + 270) % 360, 1, 0.5);
      _rgb.push(255);
      return _rgb;
    }
    var h = (hue + v * hScale) % 360;
    var rgb = hsvToRgb(h, 1, v * vScale);
    rgb.push(255);
    return rgb;
  };
};

/***/ })
/******/ ]);