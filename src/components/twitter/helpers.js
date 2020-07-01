export function tw (vm) {
  var q = document.querySelector('#twscriptloader');

  if (q) {
    q.parentNode.removeChild(q);
  }

  vm.$nextTick();

  if (!document.querySelector('#twscriptloader')) {
    var el = document.createElement('div');
    el.setAttribute('id', 'twscriptloader');

    document.querySelector('body').appendChild(el);

    var script = document.createElement('script');
    script.setAttribute('async', 'async');
    script.setAttribute('charset', 'utf-8');
    script.src = 'https://platform.twitter.com/widgets.js';

    el.appendChild(script);
  }
}
