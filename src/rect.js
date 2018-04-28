import getStats from './stats';

export default function bars(arg) {
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
        stats = getStats(dataItems, Object.keys(vmap).map(function(k){ return vmap[k]; }));
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