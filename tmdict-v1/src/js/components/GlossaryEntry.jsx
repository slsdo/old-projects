import React from 'react';
import _flatten from 'lodash/flatten';

class GlossaryEntry extends React.Component {
  componentWillMount() {
    this.setState({ lang: this.props.lang });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ lang: nextProps.lang });
  }
  handleLangSelect(lang) {
    this.setState({lang: lang});
  }
  rawMarkup(html) {
    return { __html: html };
  }
  render() {
    var permalink = this.props.entry.index.hiragana_url + '.' + this.props.entry.entry;
    var catStr = _flatten(this.props.entry[this.state.lang].category).join('/');
    return (
      <div className="entry" id={permalink}>
        <div className="entry-lang">
          <a className={(this.state.lang === 'en')? 'active' : ''} onClick={this.handleLangSelect.bind(this, 'en')}>EN</a> ・
          <a className={(this.state.lang === 'zh')? 'active' : ''} onClick={this.handleLangSelect.bind(this, 'zh')}>中</a> ・
          <a className={(this.state.lang === 'ja')? 'active' : ''} onClick={this.handleLangSelect.bind(this, 'ja')}>日</a>
        </div>
        <div className="entry-header group">
          <div className="entry-title">{this.props.entry[this.state.lang].title}</div>
          <div className="permalink"><a href={'#' + permalink} title={permalink}>#</a></div>
        </div>

        <div className="entry-main group">
          {(catStr !== '-') ? <div className="entry-category">{catStr}</div> : <div />}          
          <div className="entry-content"><p dangerouslySetInnerHTML={this.rawMarkup(this.props.entry[this.state.lang].content)} /></div>
        </div>

        {(this.props.entry[this.state.lang].notes.length === 0) ? '' :
          <div className="group">
            <div className="entry-note">
              <ol>
                {this.props.entry[this.state.lang].notes.map((n, i) => {
                  return <span key={i} dangerouslySetInnerHTML={this.rawMarkup(n)} />;
                })}
              </ol>
            </div>
          </div>}

        {(this.props.entry.img === '') ? '' :
          <div className="group">
            <div className="entry-image">
              <img title={this.props.entry[this.state.lang].title} src={'../src/img/dict/' + this.props.entry.img} alt={this.props.entry.img} />
            </div>
          </div>}
      </div>
    );
  }
}

export default GlossaryEntry;