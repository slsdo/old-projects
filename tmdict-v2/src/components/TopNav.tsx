import * as React from 'react'

import { isActive, renderNavUrl } from '../templateBuilder'
import { NameId, NavState, PageCommon } from '../types'

interface Props {
  enNav: NameId[]
  jaNav: NameId[]
  common: PageCommon
  nav: NavState
}

class TopNav extends React.Component<Props, object> {
  render() {
    /**
     * @param navIndex List of navigation indexes loaded from static source
     * @param indexLang Current navigation's language
     */
    const generateNavElement = (indices: NameId[], indexLang: string, navLang: string, navIndex: string) => {
      return indices.map((idx, i) => {
        return (
          <span className={i === 0 ? 'first' : ''} key={i}>
            <a
              className={isActive(navLang === indexLang && navIndex === idx.id)}
              href={renderNavUrl(this.props.nav, idx.id, indexLang)}
              title={idx.name}
            >
              {idx.name}
            </a>
          </span>
        )
      })
    }
    return (
      <div className="nav">
        <h1>
          <span className="tm">TM</span>
          dict
        </h1>
        <div className="nav-ver">v{this.props.common.version}</div>
        <div className="nav-index">
          {generateNavElement(this.props.jaNav, 'ja', this.props.nav.navLang, this.props.nav.navIndex)}
          <br />
          {generateNavElement(this.props.enNav, 'en', this.props.nav.navLang, this.props.nav.navIndex)}
        </div>
      </div>
    )
  }
}

export default TopNav
