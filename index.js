import hc5 from './src/main';

export default hc5;
export {default as colorLegend} from './src/colorlegend';

var root = typeof self == 'object' && self.self === self && self ||
           typeof global == 'object' && global.global === global && global ||
           this;

root.hc5 = hc5;

