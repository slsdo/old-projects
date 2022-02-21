import React from 'react';
import SidePage from './SidePage.jsx';
import SideFilter from './SideFilter.jsx';

class Side extends React.Component {
  render() {
    var side;
    if (this.props.filter.nav !== '') {
      side = <SideFilter side={this.props.side.filters} return={this.props.return} filters={this.props.filter} />;
    }
    else {
      side = <SidePage side={this.props.side[this.props.lang]} return={this.props.return} />;
    }
    return(
      <div className="side">
        {side}
      </div>
    );
  }
}

export default Side;