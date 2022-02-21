import React from 'react';
import TopNav from './TopNav.jsx';
import TopSide from './TopSide.jsx';

class Top extends React.Component {
  render() {
    return (
      <div className="top">
        <div className="top-img">
          <a href={"#"} title={this.props.site.index}>{this.props.site.index}</a>
        </div>

        <div className="nav">
          <h1><span className="tm">TM</span>dict</h1>
          <div className="nav-ver">v{this.props.ver}</div>
          <TopNav {...this.props.nav} {...this.props.filter} />
        </div>

        <TopSide langs={this.props.langs} {...this.props.site} {...this.props.filter} />
      </div>
    );
  }
}

export default Top;