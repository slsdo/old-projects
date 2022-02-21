import React from 'react';

class TopNav extends React.Component {
  render() {
    var currentNav = this.props.nav.split('.');
    var index = (currentNav[1] === undefined) ? '' : currentNav[1];
    var currentCat = (this.props.cat === '') ? '' : '+cat.' + this.props.cat;
    var currentSrc = (this.props.src === '') ? '' : '+src.' + this.props.src;
    return (
      <div className="nav-index">
        {this.props.ja.map((val, i) => {
          var dot = (val.url) ? '.' : '';
          var url = '#ja' + dot + val.url + currentCat + currentSrc;
          var isActive = (currentNav[0] === 'ja' && index === val.url) ? 'active' : '';
          return (
            <span className={(i === 0) ? 'first' : ''} key={i}>
              <a className={isActive} href={url} title={val.str}>{val.str}</a>
            </span>
          );
        })}
        <br />
        {this.props.en.map((val, i) => {
          var dot = (val.url) ? '.' : '';
          var url = '#en' + dot + val.url + currentCat + currentSrc;
          var isActive = (currentNav[0] === 'en' && index === val.url) ? 'active' : '';
          return (
            <span className={(i === 0) ? 'first' : ''} key={i}>
              <a className={isActive} href={url} title={val.str}>{val.str}</a>
            </span>
          );
        })}
      </div>
    );
  }
}

export default TopNav;