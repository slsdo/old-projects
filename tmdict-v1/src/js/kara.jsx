import React from 'react';
import ReactDOM from 'react-dom';
import GlossaryEntry from './components/GlossaryEntry.jsx';
import _forEach from 'lodash/forEach';
import _groupBy from 'lodash/groupBy';
import _sortBy from 'lodash/sortBy';

/* global glossary:false */

class App extends React.Component {
  componentWillMount() {
      this.setState({ lang: 'en' });
  }
  handleLangSelect(lang) {
    this.setState({lang: lang});
  }
  render() {
    // Group array into object of ja indices
    var rawlist = _groupBy(glossary.data, entry => { return entry.index.url; });
    // Split object into array of objects
    var sortedlist = [];
    _forEach(rawlist, (val) => {
      var index = val[0].index.text;
      // Sort by title
      var entries = _sortBy(val, entry => entry.order);
      sortedlist.push({ 'index': index, 'entries': entries });
    });
    // Sort final array by indices
    var filterlist = _sortBy(sortedlist, list => { return list.index; });
    return (
      <div id="container">
        <div id="top">
          <div className="wrapper group">
            <h1>{glossary.source[this.state.lang].name}</h1>
            <div className="nav">
              <div className="nav-info">
                {glossary.source.release_date}<br />
                {glossary.source.page}: {glossary.source[this.state.lang].part}<br />
              </div>
              <div className="nav-lang">
                <a href="#" title="EN" onClick={this.handleLangSelect.bind(this, 'en')}>English</a> |
                <a href="#" title="ZH" onClick={this.handleLangSelect.bind(this, 'zh')}>中文</a> |
                <a href="#" title="JA" onClick={this.handleLangSelect.bind(this, 'ja')}>日本語</a> |
                <a href="./">↵</a>
              </div>
            </div>
          </div>
        </div>

        <div className="wrapper">
          <div id="main">
            {filterlist.map((list, i) => {
              return (
                <div key={i}>
                  <h2 id={list.index}>{list.index}</h2>
                  {list.entries.map((entry, j) => {
                    return <GlossaryEntry lang={this.state.lang} entry={entry} key={j} />;
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('book'));