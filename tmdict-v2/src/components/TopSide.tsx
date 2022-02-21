import * as React from 'react'

import { isActive } from '../templateBuilder'
import { PageCommon } from '../types'

interface Props {
  ext: string
  extIndex: string
  lang: string
  common: PageCommon
  url: string
}

class TopSide extends React.Component<Props, object> {
  render() {
    // Generate URL for language navigation
    const langNav: string[] = this.props.common.language.map(lang => {
      return `../${lang}/${this.props.url}`
    })
    return (
      <div className="side">
        {/* Search box */}
        <div className="search">
          <form action={'search' + this.props.ext}>
            <input type="text" name="q" id="tipue_search_input" autoComplete="off" required />
          </form>
        </div>
        {/* Page navigation menu */}
        <div className="menu">
          <a title={this.props.common.about} href={'about' + this.props.ext}>
            {this.props.common.about}
          </a>{' '}
          |{' '}
          <a title={this.props.common.site} href={'site' + this.props.ext}>
            {this.props.common.site}
          </a>{' '}
          |{' '}
          <a title={this.props.common.misc} href={'misc' + this.props.ext}>
            {this.props.common.misc}
          </a>{' '}
          |{' '}
          <a title={this.props.common.book} href={'../book/' + this.props.extIndex}>
            {this.props.common.book}
          </a>
        </div>
        {/* Language navigation menu */}
        <div className="lang">
          {langNav.map((langUrl, i) => {
            const lang: string = this.props.common.language[i].toUpperCase()
            return (
              <span className={i === 0 ? 'first' : ''} key={i}>
                <a className={isActive(this.props.common.language[i] === this.props.lang)} href={langUrl} title={lang}>
                  {lang}
                </a>
              </span>
            )
          })}
        </div>
      </div>
    )
  }
}

export default TopSide
