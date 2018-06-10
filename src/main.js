import chord  from './chord';
import textLabel  from './text';
import rect   from './rect';
import colorlegend from './colorlegend';
import colorMap from './colors';

function getExtent(data, field){
    var tuple = data.map(function(d){return d[field]; });
    var min = Math.min.apply(null, tuple);
    var max = Math.max.apply(null, tuple);
    if (max == min) max += 1e-4;

    return [min, max];
}

export default function hc5(spec) {
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
        colorDomains = config.colorDomains || [],
        groups = [];

    outerRadius -= padding;

    var offset = Math.min((width / 2), (height / 2));
    var baseSVG = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + offset + "," + offset + ")");

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

        var colors = layer.colors;
        var getColor;

            
        if(layer.type == 'link') {
            rings[li] = chord({
                container: baseSVG,
                data: layer.data,
                colors: colors,
                radius: cirOffset,
                colorDomain: colorDomains[li],
                vmap: layer.vmap,
            });
            parentRing = rings[li];
            groups = parentRing.groups();
        } else if(layer.type == 'text') {
            layer.container = baseSVG;
            layer.radius = cirOffset;
            layer.groups = groups;
            rings[li] = textLabel(layer);
            cirOffset = sectionRadius + cirPadding ;
        } else {

            var dataItems = [];
            groups.forEach(function(chord, ci){
                var delta = (chord.endAngle - chord.startAngle ) / layer.data[ci].length;
                layer.data[ci].forEach(function(d, di){
                    var start =  chord.startAngle + di*delta;
                    d.startAngle = start;
                    d.endAngle = start + delta;
                    d.index = chord.index;
                })
                dataItems = dataItems.concat(layer.data[ci]);
            })

            var colorDomain = getExtent(dataItems, layer.vmap.color);

            getColor = colorMap(layer.colors, colorDomain);

            if(layer.type == 'bar') {
                rings[li] = rect({
                    container: baseSVG,
                    groups: groups,
                    data: dataItems,
                    innerRadius: cirOffset,
                    outerRadius: sectionRadius,
                    colors: getColor,
                    colorDomain: colorDomain,
                    vmap: layer.vmap || layer.encoding,
                });
                cirOffset = sectionRadius + cirPadding;
            } 
        }


        if(layer.type !== 'text' && layer.vmap) {
            if(layer.legend) {
                if(rings[li].colorDomain) colorDomain = rings[li].colorDomain;
                colorLegend({
                    container: baseSVG,
                    colors: layer.colors,
                    height: Math.min(50, outerRadius/2 / layerlayer.length) ,
                    width: width/2 - outerRadius / 2 - padding * 4,
                    title: layer.project + ' (' + ((layer.vmap) ? layer.vmap.color : null) + ')',
                    domain: colorDomain,
                    pos: [outerRadius/2 + padding*4, padding*2 + outerRadius/2 + outerRadius/2 / (layerlayer.length-1) * si]
                })
            }
        }

        if(chartTitle) {
            baseSVG.append("text")
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

