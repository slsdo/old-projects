import React from 'react';

class SidePage extends React.Component {
  rawMarkup(html) {
    return { __html: html };
  }
  render() {
    return (
      <div className="side-content">
        <h2><span className="first-char">T</span>op</h2>
        <div dangerouslySetInnerHTML={this.rawMarkup(this.props.side)} />
        <div className="side-menu">
          <div className="menu-arrow">
            <a href={'#'} title={this.props.return}>&laquo;</a>
          </div>
        </div>
      </div>
    );
  }
}

export default SidePage;