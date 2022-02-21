import React from 'react';
import MainPage from './MainPage.jsx';
import MainFilter from './MainFilter.jsx';

class Main extends React.Component {
  render() {
    var main;
    if (this.props.filter.nav !== '') {
      main = <MainFilter filter={this.props.filter} />;
    }
    else {
      main = <MainPage lang={this.props.filter.lang} updates={this.props.updates} />;
    }
    return(
      <div className="main">
        {main}
      </div>
    );
  }
}

export default Main;