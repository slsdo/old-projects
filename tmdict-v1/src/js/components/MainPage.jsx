import React from 'react';

class MainPage extends React.Component {
  rawMarkup(html) {
    return { __html: html };
  }
  renderUpdates() {
    return (
      this.props.updates.map((val, i) =>
        <div key={i}>
          <h4>{val.date}</h4>
          <div dangerouslySetInnerHTML={this.rawMarkup(val[this.props.lang].summary)} />
          <p><span className="highlight">v{val.version}:</span></p>
          <ul dangerouslySetInnerHTML={this.rawMarkup(val[this.props.lang].log)} />
        </div>
      )
    );
  }
  render() {
    return (
      <div className="main-content">
        <div className="page-content">
          {this.renderUpdates()}
        </div>
      </div>
    );
  }
}

export default MainPage;