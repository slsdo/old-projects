import React from 'react';
import _flatten from 'lodash/flatten';
import _uniq from 'lodash/uniq';

class MainFilterList extends React.Component {
  render() {
    return (
      <div className="filter-list">
        <h4>{this.props.list.index}</h4>
        <ul>
          {this.props.list.entries.map((entry, i) => {
            var isFirstFlag = (i === 0) ? true : false;
            var catArr = _uniq(_flatten(entry[this.props.lang].category)).join('/');
            var srcArr = _uniq(entry[this.props.lang].source.map((src) => src.gls_name)).join(', ');
            var isCat = (this.props.cat !== '') ? _flatten(entry.category).includes(this.props.cat) : true;
            var isSrc = (this.props.src !== '') ? entry.source.map((s) => s.src).includes(this.props.src) : true;
            if (isCat && isSrc) {
              var isFirst = (isFirstFlag) ? ' first' : '';
              isFirstFlag = false;
              return (
                <li key={i}>
                  <a href={entry.index.ja.hiragana_url + '.' + entry.entry} title={this.props.title}>
                    <div className={'entry filter-list-item group' + isFirst}>
                      <div className="entry-title">{entry[this.props.lang].title}</div>
                      <div className="entry-category">{catArr}</div>
                      <div className="entry-glossary">{srcArr}</div>
                    </div>
                  </a>
                </li>
              );
            }
          })}
        </ul>
      </div>
    );
  }
}

export default MainFilterList;