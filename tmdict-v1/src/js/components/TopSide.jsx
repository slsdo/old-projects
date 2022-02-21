import React from 'react';

class TopSide extends React.Component {
  render() {
    var currentCat = (this.props.cat === '') ? '' : '+cat.' + this.props.cat;
    var currentSrc = (this.props.src === '') ? '' : '+src.' + this.props.src;
    var url = this.props.langs.map((val) => {
      return ('../' + val + '/#' + this.props.nav + currentCat + currentSrc);
    });
    return (
      <div className="side">
        <div className="search">
          <form action="search.html">
          <input type="text" name="q" id="tipue_search_input" autoComplete="off" required />
          </form>
        </div>

        <div className="menu">
          <a href="about" title={this.props.about}>{this.props.about}</a>
          {' | '}
          <a href="site" title={this.props.site}>{this.props.site}</a>
          {' | '}
          <a href="misc" title={this.props.misc}>{this.props.misc}</a>
          {' | '}
          <a href="../book/" title={this.props.book}>{this.props.book}</a>
        </div>

        <div className="lang">
          {url.map((val, i) => {
            var isActive = (this.props.lang === this.props.langs[i]) ? 'active' : '';
            return (
              <span className={(i === 0) ? 'first' : ''} key={i}>
                <a className={isActive} href={val} title={this.props.langs[i]}>{this.props.langs[i].toUpperCase()}</a>
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}

export default TopSide;