import chord  from './chord';
import textLabel  from './text';
import rect   from './rect';
import legend from './legend';

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
            rings[li] = chord({
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
            rings[li] = rect({
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
            rings[li] = textLabel(s);
            cirOffset = sectionRadius + cirPadding ;
        }

        if(layer.type !== 'text' && layer.vmap) {
            if(layer.legend) {
                if(rings[li].colorDomain) colorDomain = rings[li].colorDomain;
                legend({
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

