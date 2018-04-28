export default function Chord(arg) {
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

