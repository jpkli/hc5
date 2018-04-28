export default function Text(arg) {
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

