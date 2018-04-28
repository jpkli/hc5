var gradID = 0;
export default function colorLegend(arg){
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

