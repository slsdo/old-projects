import React from 'react';
import _forEach from 'lodash/forEach';
import _groupBy from 'lodash/groupBy';
import _sortBy from 'lodash/sortBy';
import MainFilterList from './MainFilterList.jsx';
import db from '../constants/dict.js';

class MainFilter extends React.Component {
  render() {
    var navLang = this.props.filter.nav.split('.')[0];
    var navIndex = (this.props.filter.nav.split('.')[1] !== undefined) ? this.props.filter.nav.split('.')[1] : '';
    // Group array into object of en/ja indices
    var rawlist = _groupBy(db.data, entry => { return entry.index[navLang].url; });
    // Split object into array of objects
    var sortedlist = [];
    _forEach(rawlist, (val, key) => {
      // Compare index url, then saves its equivalent string and entries as object
      if (navIndex === '' || navIndex === key) {
        var index = val[0].index[navLang].text;
        var entries = [];
        if (navLang === 'en') {
          // Sort alphabetically by en
          entries = _sortBy(val, entry => {
            return entry['en'].title;
          });
        }
        else if (navLang === 'ja') {
          // Sort by furigana, then hiragana
          entries = _sortBy(
            _sortBy(val, entry => {
              return entry.index['ja']['furigana'];
            }), entry => {
            return entry.index['ja']['hiragana'];
          });
        }
        sortedlist.push({ 'index': index, 'entries': entries });
      }
    });
    // Sort final array by indices
    var filterlist = _sortBy(sortedlist, list => { return list.index; });
    return (
      <div className="main-content">
        {filterlist.map((list, i) => {
          return (
            <MainFilterList list={list} {...this.props.filter} key={i} />
          );
        })}
      </div>
    );
  }
}

export default MainFilter;