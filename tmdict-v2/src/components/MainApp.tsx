import * as React from 'react'

import { getFilterList, getFilterListIndex } from '../dataParser'
import { renderAppContent } from '../templateBuilder'
import { MainProps, Metadata, NavState } from '../types'
import { content } from './data/content'
import { dict } from './data/dict'

interface Props {
  main: MainProps
  metadata: Metadata
  nav: NavState
}

class MainApp extends React.Component<Props, object> {
  render() {
    /**
     * Render filter list if navigation is set, else display index page content
     */
    const renderMain = () => {
      if (this.props.nav.navLang !== '') {
        return (
          <div className="filter-list">
            {getFilterListIndex(this.props.nav.navLang, this.props.nav.navIndex).map((idx, i) => {
              return (
                <React.Fragment key={i}>
                  <h4>{idx.name}</h4>
                  <ul>
                    {getFilterList(
                      dict,
                      idx.id,
                      this.props.nav.navLang,
                      this.props.nav.filterSrc,
                      this.props.nav.filterCat
                    ).map((entry, j) => {
                      const isFirst = j === 0 ? ' first' : ''
                      return (
                        <li key={j}>
                          <a
                            href={`${entry.index.ja.id}.${entry.title.id}${this.props.metadata.ext}`}
                            title={entry.title.lang[this.props.nav.pageLang]}
                          >
                            <div className={'entry filter-list-item group' + isFirst}>
                              <div className="entry-title">{entry.title.lang[this.props.nav.pageLang]}</div>
                              <div className="entry-category">
                                {renderAppContent(entry.category, ' / ', this.props.nav.pageLang)}
                              </div>
                              <div className="entry-glossary">
                                {renderAppContent(entry.glossary, ', ', this.props.nav.pageLang)}
                              </div>
                            </div>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </React.Fragment>
              )
            })}
          </div>
        )
      } else {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: content[this.props.nav.pageLang],
            }}
          />
        )
      }
    }
    return (
      <div className="main">
        <div className="main-content">{renderMain()}</div>
      </div>
    )
  }
}

export default MainApp
