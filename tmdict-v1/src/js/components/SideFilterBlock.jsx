import React from 'react';

class SideFilterBlock extends React.Component {
  render() {
    return (
      <div>
        <h2><span className="first-char">{this.props.title.slice(0, 1)}</span>{this.props.title.slice(1, this.props.title.length)}</h2>
        <ul>
          <li className={(this.props[this.props.type] === '') ? 'active' : ''}>
            <a href={this.props.url(this.props.type, '')} title="all">
              <div className="entry group">
                <div className={'entry-' + this.props.title}>all</div>
              </div>
            </a>
          </li>
          {this.props.sidefilters.map((val, i) => {
            return (
              <li className={(val.url === this.props[this.props.type]) ? 'active' : ''} key={i}>
                <a href={this.props.url(this.props.type, val.url)} title={val[this.props.lang]}>
                  <div className="entry group">
                    <div className={'entry-' + this.props.title}>{val[this.props.lang]}</div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default SideFilterBlock;