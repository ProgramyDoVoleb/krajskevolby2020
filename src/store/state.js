import regions from './data/obecne/info/kv.json';
import parties2016 from './data/volby/kv/2016/strany.json';
import results2016 from './data/volby/kv/2016/vysledky.json';
import quiz from './data/quiz';
// import coalition2016 from './data/volby/kv/2016/krajska-zastupitelstva.json';

const state = {
  static: {
    regions,
    previous2016: {
      parties: parties2016,
      results: results2016,
      coalition: []
    },
    quiz,
    topics: ['stav silnic', 'kvalita veřejné dopravy', 'dopravní spojení', 'dostupnost zdravotnictví', 'koronavirus', 'životní prostředí', 'sucho', 'dostupnost bydlení', 'vylidňování venkova', 'vyloučené lokality', 'podpora turismu', 'dostupnost škol a školek', 'nedostatek práce', 'chybí zajímaví zaměstnavatelé', 'nezaměstnanost', 'kriminalita', 'pocit bezpečnosti', 'korupce', 'vyřešit kauzy vedení kraje', 'konec těžby uhlí', 'kůrovec', 'odliv mozků', 'kultura', 'množství obchodů a služeb', 'digitalizace krajské správy', 'aktivity pro seniory', 'využití EU fondů'],
  },
  data: {
    candidates: [],
    parties: []
  },
  dynamic: {
    towns: [],
    callout: [],
    parties: [],
    source: []
  },
  tick: 0,
  start: new Date().getTime(),
  width: 0,
  root: 'https://data.polist.cz/',
  server: 'https://data.polist.cz/'
};

export default state;
