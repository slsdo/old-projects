import React from 'react';
import SideFilterBlock from './SideFilterBlock.jsx';

class SideFilter extends React.Component {
  url(type, filter) {
    var url = '';
    var currentCat = (this.props.filters.cat === '') ? '' : '+cat.' + this.props.filters.cat;
    var currentSrc = (this.props.filters.src === '') ? '' : '+src.' + this.props.filters.src;
    var newCat = (filter === '') ? '' : '+cat.' + filter;
    var newSrc = (filter === '') ? '' : '+src.' + filter;
    switch (type) {
      case 'cat': url = '#' + this.props.filters.nav + newCat + currentSrc; break;
      case 'src': url = '#' + this.props.filters.nav + currentCat + newSrc; break;
      default: url = '#' + this.props.filters.nav + currentCat + currentSrc; break;
    }
    return url;
  }
  render() {
    return (
      <div className="side-content">
        <SideFilterBlock type="src" title="source" sidefilters={this.props.side.src} url={this.url.bind(this)} {...this.props.filters} />
        <SideFilterBlock type="cat" title="category" sidefilters={this.props.side.cat} url={this.url.bind(this)} {...this.props.filters} />
        <div className="side-menu">
          <div className="menu-arrow">
            <a href={'#'} title={this.props.return}>&laquo;</a>
          </div>
        </div>
      </div>
    );
  }
}

export default SideFilter;