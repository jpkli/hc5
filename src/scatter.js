import getStats from './stats';

export default function scatter(arg) {
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

    var getSize = function() { return 5; },
        getPosX = function() { return 0; },
        getColor = (typeof colors === 'function') ? colors : function() { return colors[0]};

    if(stats === null) {
        stats = getStats(dataItems, Object.keys(vmap).map(function(k){ return vmap[k]; }));
    }

    if(vmap.color && typeof(colors) != 'function') {
        if(stats[vmap.color].max == stats[vmap.color].min) stats[vmap.color].max+=1e-6;

        if(typeof colors == 'function') {
            getColor = colors;
        } else {
            getColor =  d3.scale.linear()
                .domain([stats[vmap.color].min, stats[vmap.color].max])
                .range(colors);
        }
    }

    if(vmap.x) {
        getPosX = d3.scale.linear()
            .domain([stats[vmap.x].min, stats[vmap.x].max])
            .range([0, outerRadius]);
    }

    if(vmap.y) {
        getPosY =  d3.scale.linear()
            .domain([stats[vmap.y].min, stats[vmap.y].max])
            .range([innerRadius, outerRadius]);
    }

    function createArc(d) {
        return d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(getSize(d[vmap.size]))
            (d);
    }

    var visualElement = svg.append("g").selectAll(".dot")
        .data(dataItems)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d){return getSize(d[vmap.size])})
        .attr("cx", function(d){return getPosX(d[vmap.x])})
        .attr("cy",function(d){return getPosY(d[vmap.y])})
        .style("fill", function(d){return getColor(d[vmap.color])});

    bars.svg = svg;
    bars.colorDomain = [stats[vmap.color].min, stats[vmap.color].max];
    return bars;
}

