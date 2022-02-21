import React from 'react';
import page from 'page';
import Top from './Top.jsx';
import Main from './Main.jsx';
import Side from './Side.jsx';
import site from '../constants/site.js';

class App extends React.Component {
  componentWillMount() {
    page('/:lang/*', (ctx) => {
      var nav = '', cat = '', src = '';
      var regexNav = ctx.hash.match(/^([\w]*\.?[a-zA-Z_]*)/);
      var regexCat = ctx.hash.match(/\scat\.([a-zA-Z0-9-_]*)/);
      var regexSrc = ctx.hash.match(/\ssrc\.([a-zA-Z0-9-_]*)/);
      var isJa = (regexNav[1].match(/^ja.[_kstnhmyrw]|^ja$/) !== null);
      var isEn = (regexNav[1].match(/^en.[a-zA-Z_]$|^en$/) !== null);
      if (regexNav !== null && (isJa || isEn)) {
        nav = regexNav[1];
        cat = (regexCat !== null) ? regexCat[1] : '';
        src = (regexSrc !== null) ? regexSrc[1] : '';
      }
      this.setState({ lang: ctx.params.lang, nav: nav, cat: cat, src: src });
    });
    page({click: false});
  }
  render() {
    return (
      <div className="wrapper group">
        <Top filter={this.state} ver={site.version} langs={site.language} site={site[this.state.lang]} nav={site.nav} />
        <Main filter={this.state} updates={site.updates} />
        <Side lang={this.state.lang} filter={this.state} side={site.side} {...site[this.state.lang]} />
      </div>
    );
  }
}

export default App;