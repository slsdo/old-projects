import * as React from 'react'

import { renderNavUrl } from '../templateBuilder'
import { Metadata, NavState, TopProps } from '../types'

import TopNav from './TopNav'
import TopSide from './TopSide'

interface Props {
  top: TopProps
  metadata: Metadata
  nav: NavState
}

class Top extends React.Component<Props, object> {
  render() {
    return (
      <div className="top">
        <div className="top-img">
          <a
            title={this.props.metadata.common.index}
            href={'../' + this.props.nav.pageLang + '/' + this.props.metadata.extIndex}
          >
            {this.props.metadata.common.index}
          </a>
        </div>
        <TopNav
          enNav={this.props.top.enNav}
          jaNav={this.props.top.jaNav}
          common={this.props.metadata.common}
          nav={this.props.nav}
        />
        <TopSide
          ext={this.props.metadata.ext}
          extIndex={this.props.metadata.extIndex}
          lang={this.props.nav.pageLang}
          common={this.props.metadata.common}
          url={
            this.props.metadata.url !== ''
              ? this.props.metadata.url + this.props.metadata.ext
              : renderNavUrl(this.props.nav, this.props.nav.navIndex)
          }
        />
      </div>
    )
  }
}

export default Top
