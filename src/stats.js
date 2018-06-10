export default function stats(data, fields){

    if(!Array.isArray(data))
        throw new Error("Inproper input data format.");

    var result = {};

    fields.forEach(function(f) {
        var a = data.map(function(d){return d[f]; });
        result[f] = {
            min: Math.min.apply(null, a),
            max: Math.max.apply(null, a)
        };
    });

    return result;
};