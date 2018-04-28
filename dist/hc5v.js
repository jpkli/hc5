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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../.nvm/versions/node/v8.11.1/lib/node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _src_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/main */ "./src/main.js");


var root = typeof self == 'object' && self.self === self && self ||
           typeof global == 'object' && global.global === global && global ||
           undefined;

root.h5cv = _src_main__WEBPACK_IMPORTED_MODULE_0__["default"];
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../.nvm/versions/node/v8.11.1/lib/node_modules/webpack/buildin/global.js */ "../../../.nvm/versions/node/v8.11.1/lib/node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/chord.js":
/*!**********************!*\
  !*** ./src/chord.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Chord; });
function Chord(arg) {
    var options = arg || {},
        container = options.container || "body",
        data = options.data,
        vmap = options.vmap,
        width = options.width || 800,
        height = options.height || width,
        radius = options.radius || Math.min(width/2, height/2),
        padding = options.padding || 0.1,
        colorDomain = options.colorDomain || null,
        colors = options.colors || ['steelblue', 'red'],
        hover = options.hover || function(d) {};

    if(!vmap.hasOwnProperty("size"))
        vmap.size = 'count';

    var matrix = data.map(function(rows){
        return rows.map(function(row){
            return row[vmap.size];
        });
    });

    var chord = d3.layout.chord()
        .padding( 0.1)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    var colorValues = [];

    data.forEach(function(rows){
        rows.forEach(function(row){
            colorValues = colorValues.concat(row[vmap.color]);
        });
    });

    if(colorDomain === null) {
        colorDomain = [Math.min.apply(null, colorValues), Math.max.apply(null, colorValues)];
    }

    var colorScale;

    if(typeof colors == 'function') {
        colorScale = colors;
    } else {
        colorScale = d3.scale.linear()
            .domain([colorDomain[0], colorDomain[1]])
            .range(colors);
    }

    var svg;
    if(typeof container.append === 'function') {
        svg = container;
    } else {
        var offset = Math.min((width / 2), (height / 2))
        svg = d3.select(container).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + offset + "," + offset + ")");
    }

    var core = svg.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter();

    var ribbons = core.append("path").attr("class", "ribbons")
        .attr("d", d3.svg.chord().radius(radius))
        .style("fill", function(d){
            var send = data[d.source.index][d.target.index][vmap.color];
            var recv =  data[d.target.index][d.source.index][vmap.color];
            return colorScale(Math.max(send, recv));
        })
        .style("stroke", "#FFF")
        .style("opacity", 1);

    chord.svg = svg;
    chord.colorDomain = colorDomain;
    chord.updateColor = function(colorDomain) {
        chord.colorDomain = colorDomain;
        colorScale.domain(colorDomain);
        d3.selectAll('.ribbons').style("fill", function(d){
            var send = data[d.source.index][d.target.index][vmap.color];
            var recv =  data[d.target.index][d.source.index][vmap.color];
            return colorScale(Math.max(send, recv));
        })
    }
    return chord;
}



/***/ }),

/***/ "./src/legend.js":
/*!***********************!*\
  !*** ./src/legend.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return colorLegend; });
var gradID = 0;
function colorLegend(arg){
    var option = arg || {},
        container = option.container || null,
        width = option.width || 200,
        height = option.height || 20,
        pos = option.pos ||[0, 0],
        padding = option.padding || {left: 15, right: 15, top: 20, bottom: 0},
        vmap = option.vmap || {},
        noLabel = option.nolabel || false,
        colors = option.colors || ['#eee', 'steelblue'],
        domain = option.domain || ['min', 'max'],
        format = option.format || d3.format(".2s");

    var gradientID = gradID++;

    width -= padding.left + padding.right;
    height -= padding.top + padding.bottom;

    var legend = (container === null) ? new Svg({width: width, height: height, padding: padding}) : container.svg,
        rect = legend.append("g");

    if(container !== null){
        if(typeof container.append === 'function')
            container.append(legend);
        else if(typeof container.appendChild === 'function')
            container.appendChild(legend);
        else if(typeof container === 'string')
            document.getElementById(container).appendChild(legend);
    }

    function linearDomain(domain, n){
        var step = (domain[1] - domain[0])/(n),
            res = [];
        for(var i = domain[0]; i<=domain[1]; i+=step) {
            res.push(i);
        }

        res.push(domain[1]);
        return res;
    }

    var colorScale = d3.scale.linear().domain(linearDomain([0, colors.length], colors.length)).range(colors);

    function linearGradient(colors) {
        var gradient = legend.append("defs")
            .append("linearGradient")
                .attr("id", "gradlegend"+gradientID)
                .attr("x1", "0%")
                .attr("x2", "100%")
                .attr("y1", "0%")
                .attr("y2", "0%");

        colors.forEach(function(c, i){
            gradient.append("stop")
                .attr("offset", i / colors.length )
                .attr("stop-color", c);
        });
        return gradient;
    }

    var grad = linearGradient(colors);

    var rect = legend.append("g");

    var colorScale = rect.append("rect")
        .attr("x", pos[0])
        .attr("y", pos[1])
        .attr("width", width-padding.left)
        .attr("height", height)
        .style("fill","url(#gradlegend" + gradientID + ")");

    if(!noLabel) {
        legend.append("text")
            .attr("x", pos[0] - 5)
            .attr("y", pos[1] + height/2 + 5)
            .style("fill", "#222")
            .style("text-anchor", 'end')
            // .style("font-size", ".9em")
            .text(format(domain[0]));

        legend.append("text")
            .attr("x", pos[0] + width - padding.left + 5)
            .attr("y", pos[1] + height/2 + 5)
            .style("fill", "#222")
            .style("text-anchor", 'begin')
            // .style("font-size", ".9em")
            .text(format(domain[1]));
    }


    if(option.title) {
        legend.append("g")
            .append("text")
            .attr("y", pos[1] - padding.top)
            .attr("x", pos[0] + width/2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(option.title);
    }

    return legend;
}



/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hc5v; });
/* harmony import */ var _chord__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chord */ "./src/chord.js");
/* harmony import */ var _text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./text */ "./src/text.js");
/* harmony import */ var _rect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rect */ "./src/rect.js");
/* harmony import */ var _legend__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./legend */ "./src/legend.js");





function hc5v(spec) {
    let layers = spec.layers;
    let rings = new Array(layers.length);

    var config = spec.config,
        width = config.width || 800,
        height = config.height || width,
        padding = config.padding || 10,
        outerRadius = config.outerRadius || Math.min(width/2, height/2),
        innerRadius = config.innerRadius || Math.min(width/4, height/4),
        container = config.container || "body",
        parentRing = container,
        chartTitle = config.chartTitle || false,
        colorDomains = config.colorDomains || [];

    outerRadius -= padding;

    var cirRange = outerRadius - innerRadius - padding,
        cirOffset = innerRadius,
        sectionRadius = cirOffset,
        cirSize = layers
            .map(function(layer){ return layer.size; })
            .reduce(function(a,b){return a+b;});

    layers.forEach(function(layer, li){
        var sectionRadiusRange =  cirOffset + layer.size / cirSize * cirRange,
            cirPadding = 0.05 * sectionRadiusRange,
            sectionRadius = sectionRadiusRange,
            colorDomain = ['min', 'max'];

        if(layer.type == 'link') {
            rings[li] = Object(_chord__WEBPACK_IMPORTED_MODULE_0__["default"])({
                container: container,
                data: layer.data,
                width: width,
                height: height,
                colors: layer.colors,
                radius: cirOffset,
                colorDomain: colorDomains[li],
                vmap: layer.vmap,
            });
            parentRing = rings[li];
            container = rings[li];
        }
        else if(layer.type == 'bar') {
            rings[li] = Object(_rect__WEBPACK_IMPORTED_MODULE_2__["default"])({
                container: container,
                data: layer.data,
                innerRadius: cirOffset,
                outerRadius: sectionRadius,
                colors: layer.colors,
                colorDomain: colorDomains[li],
                vmap: layer.vmap || layer.encoding,
            });
            cirOffset = sectionRadius + cirPadding;
        } else if(layer.type == 'text') {
            layer.container = container;
            layer.radius = cirOffset;
            rings[li] = Object(_text__WEBPACK_IMPORTED_MODULE_1__["default"])(s);
            cirOffset = sectionRadius + cirPadding ;
        }

        if(layer.type !== 'text' && layer.vmap) {
            if(layer.legend) {
                if(rings[li].colorDomain) colorDomain = rings[li].colorDomain;
                Object(_legend__WEBPACK_IMPORTED_MODULE_3__["default"])({
                    container: container,
                    colors: layer.colors,
                    height: Math.min(50, outerRadius/2 / layerlayer.length) ,
                    width: width/2 - outerRadius / 2 - padding * 4,
                    title: layer.project + ' (' + ((layer.vmap) ? layer.vmap.color : null) + ')',
                    domain: colorDomain,
                    pos: [outerRadius/2 + padding*4, padding*2 + outerRadius/2 + outerRadius/2 / (layerlayer.length-1) * si]
                })
            }
        }

        if(typeof container.svg.append == 'function' && chartTitle) {
            container.svg.append("text")
                .style("font-size", "1.1em")
                .style("text-anchor", "middle")
                .attr("x", 0)
                .attr("y", height/2 - 15)
                .text(function(d, i) { return  chartTitle });
        }
    })

    rings.updateColor = function(colorDomains) {
        rings.forEach(function(ring, ri){

            if(layers[ri].type !== 'text') {

                ring.updateColor(colorDomains[ri]);
            }
        })
    }
    return rings;
}



/***/ }),

/***/ "./src/rect.js":
/*!*********************!*\
  !*** ./src/rect.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return bars; });
/* harmony import */ var _stats__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stats */ "./src/stats.js");


function bars(arg) {
    var options = arg || {},
        container = options.container || "body",
        data = options.data,
        vmap = options.vmap,
        width = options.width || 800,
        height = options.height || width,
        outerRadius = options.outerRadius || Math.min(width/2, height/2),
        innerRadius = options.innerRadius || outerRadius / 4,
        padding = options.padding || 0.05,
        domain = options.domain || null,
        colorDomain = options.colorDomain || null,
        stats = options.stats || null,
        colors = options.colors || ['white', 'steelblue'],
        hover = options.hover || function(d) {};

    var chords = container.groups();
    var dataItems = [];
    chords.forEach(function(chord, ci){
        var delta = (chord.endAngle - chord.startAngle ) / data[ci].length;
        data[ci].forEach(function(d, di){
            var start =  chord.startAngle + di*delta;
            d.startAngle = start;
            d.endAngle = start + delta;
            d.index = chord.index;
        })
        dataItems = dataItems.concat(data[ci]);
    })

    var svg = container.svg;

    var bars = svg.append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    var getSize = function() { return outerRadius; },
        getColor = (typeof colors === 'function') ? colors : function() { return colors[0]};

    if(stats === null) {
        stats = Object(_stats__WEBPACK_IMPORTED_MODULE_0__["default"])(dataItems, Object.keys(vmap).map(function(k){ return vmap[k]; }));
    }

    if(vmap.color && typeof(colors) != 'function') {

        if(colorDomain === null) {
            if(stats[vmap.color].max == stats[vmap.color].min) stats[vmap.color].max+=0.000001;
            colorDomain = [stats[vmap.color].min, stats[vmap.color].max];
        }

        if(typeof colors == 'function') {
            getColor = colors;
        } else {
            getColor =  d3.scale.linear()
                .domain(colorDomain)
                .range(colors);
        }
    }

    if(vmap.size) {
        getSize =  d3.scale.pow().exponent(0.9)
            .domain([stats[vmap.size].min, stats[vmap.size].max])
            .range([innerRadius, outerRadius]);
    }

    function createArc(d) {
        return d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(getSize(d[vmap.size]))
            (d);
    }

    var ring = svg.append("g").selectAll(".bar")

        .data(dataItems)
        .enter()

    var marks = ring.append("path").attr("class", "bars")
        .attr('class', 'bars')
        .style("fill", function(d) { return getColor(d[vmap.color]); })
        // .style("stroke", function(d) { return getColor(d[vmap.color]); })
        .style("stroke", '#fff')
        .style("stroke-width", 0.5)
        // .style("fill-opacity", function(d){return getOpacity(d[opacityAttr])})
        .attr("d", createArc)
        // .on("mouseover", highlight)
        // .on("mouseout", unhighlight);
    // visualElement
    //     .style("stroke", '#fff')
    //     .style("stroke-width", 0.5);
    bars.svg = svg;
    bars.colorDomain = colorDomain;
    bars.updateColor = function(colorDomain) {
        bars.colorDomain = colorDomain;
        getColor.domain(colorDomain);
        d3.selectAll(".bars").style("fill", function(d) { return getColor(d[vmap.color]); })
    }

    return bars;
}

/***/ }),

/***/ "./src/stats.js":
/*!**********************!*\
  !*** ./src/stats.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return stats; });
function stats(data, fields){

    if(!Array.isArray(data))
        throw new Error("Inproper input data format.");

    var result = {};

    fields.forEach(function(f) {
        var a = data.map(function(d){return d[f]; });
        result[f] = {
            min: array.min(a),
            max: array.max(a),
            avg: array.avg(a),
            std: array.std(a)
        };
    });

    return result;
};

/***/ }),

/***/ "./src/text.js":
/*!*********************!*\
  !*** ./src/text.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Text; });
function Text(arg) {
    var options = arg || {},
        container = options.container || "body",
        data = options.data,
        prefix = options.prefix || '',
        radius = options.radius || 200,
        color = options.color || '#000000',
        hover = options.hover || function(d) {};

    var chords = container.groups();
    // chords.forEach(function(chord, ci){
    //
    //     data[ci].startAngle = chord.startAngle
    //     data[ci].endAngle = chord.endAngle;
    //     data[ci].index = chord.index;
    // })

    function textTransofrm(d) {
        var offset = (d.startAngle + (d.endAngle - d.startAngle)/2);
        return (offset > Math.PI/2 && offset < 1.5*Math.PI) ? "rotate(270)" :"rotate(90)";
    }

    function textRotate(d) {
        var offset = (d.startAngle + (d.endAngle - d.startAngle)/2);
        return "rotate(" + ( offset * 180 / Math.PI - 90)
            + ")translate(" + (radius+5) + ",0)";
    }

    var groupLabel = container.svg.append("g").selectAll("groupLabel")
            .data(chords)
            .enter().append("g")
            .attr("transform", textRotate);

    groupLabel.append("text")
        .style("font-size", "0.9em")
        .style("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("transform",  textTransofrm)
        .text(function(d, i) { return  prefix + data[i]; });

    return groupLabel;
}



/***/ })

/******/ });
//# sourceMappingURL=hc5v.js.map