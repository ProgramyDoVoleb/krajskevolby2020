import regions from './data/obecne/info/kv.json';
import parties2016 from './data/volby/kv/2016/strany.json';
import results2016 from './data/volby/kv/2016/vysledky.json';
// import coalition2016 from './data/volby/kv/2016/krajska-zastupitelstva.json';

const state = {
  static: {
    regions,
    previous2016: {
      parties: parties2016,
      results: results2016,
      coalition: []
    }
  },
  dynamic: {
    towns: []
  },
  tick: 0,
  start: new Date().getTime()
};

export default state;
