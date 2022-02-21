import * as React from 'react'

import { APP, PAGE_TYPE } from '../constants'
import { isActive, renderEntrySideCategory } from '../templateBuilder'
import { Entry, Metadata, NavState, SideProps } from '../types'

import SideFilter from './SideFilter'

interface Props {
  side: SideProps
  metadata: Metadata
  nav: NavState
}

class Side extends React.Component<Props, object> {
  render() {
    const renderSide = () => {
      /**
       * Types of side content:
       * - App: A dynamic list of categories and sources that users can use to sort and filter
       * - Entry: Sorted list of entries from the same hiragana group
       * - Page: Static site-related content
       */
      switch (this.props.metadata.type) {
        case PAGE_TYPE.app: {
          /**
           * Render side filter list if navigation is set, else display index page side content
           */
          if (this.props.nav.navLang !== '') {
            return (
              <>
                {/* Source filter */}
                <h2>
                  <span className="first-char">s</span>
                  ource
                </h2>
                <SideFilter nav={this.props.nav} name={APP.src} filter={this.props.nav.filterSrc} />
                {/* Category filter */}
                <h2>
                  <span className="first-char">c</span>
                  ategory
                </h2>
                <SideFilter nav={this.props.nav} name={APP.cat} filter={this.props.nav.filterCat} />
              </>
            )
          } else {
            return (
              <>
                <h2>
                  <span className="first-char">{this.props.side.titleTop}</span>
                  {this.props.side.title}
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.props.metadata.common.side,
                  }}
                />
              </>
            )
          }
        }
        case PAGE_TYPE.entry: {
          return (
            <>
              <h2>
                <span className="first-char">{this.props.side.titleTop}</span>
                {this.props.side.title}
              </h2>
              <ul>
                {this.props.side.content.map((e: Entry, i) => {
                  return (
                    <li className={isActive(this.props.metadata.id === e.id)} key={i}>
                      <a
                        title={e.title[this.props.nav.pageLang]}
                        href={`${e.index.ja.id}.${e.id}${this.props.metadata.ext ? '.html' : ''}`}
                      >
                        <div className="entry group">
                          <div className="entry-title">{e.title[this.props.nav.pageLang]}</div>
                          <div className="entry-category">{renderEntrySideCategory(e, this.props.nav.pageLang)}</div>
                        </div>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </>
          )
        }
        case PAGE_TYPE.page:
          return (
            <>
              <h2>
                <span className="first-char">{this.props.side.titleTop}</span>
                {this.props.side.title}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.props.metadata.common.side,
                }}
              />
            </>
          )
      }
    }
    return (
      <div className="side">
        <div className="side-content">
          {renderSide()}
          <div className="side-menu">
            <div className="menu-arrow">
              <a title={this.props.metadata.common.return} href={this.props.metadata.returnUrl}>
                &laquo;
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Side
