import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { BookGlossary, BookGlossaryEntry, Section, Source } from '../types'
import { glossary } from './data/book'

import BookEntry from './BookEntry'

export interface BookProps {
  data: BookGlossary
}

export interface BookState {
  glossary: string
  lang: string
}

// Convert glossaries into array of sorted (by date) source object for TOC
const getGlossaryToc = (data: BookGlossary): Array<{ source: Source; section: Section }> => {
  return Object.keys(data)
    .sort((a: string, b: string) => data[a].source.date.localeCompare(data[b].source.date))
    .map(sortedKey => ({
      section: data[sortedKey].section,
      source: data[sortedKey].source,
    }))
}

class Book extends React.Component<BookProps, BookState> {
  constructor(props: BookProps) {
    super(props)
    this.state = {
      glossary: window.location.hash.substr(1),
      lang: 'en',
    }
  }
  handleClick(lang: string, gls: string) {
    this.setState({
      glossary: gls,
      lang,
    })
  }
  render() {
    const renderGlossary = () => {
      // If no (valid) glossary selected, display TOC
      if (this.state.glossary === '' || !this.props.data.hasOwnProperty(this.state.glossary)) {
        return (
          <div id="toc">
            <h1>Glossary § 辞典</h1>
            <div className="separator" />
            <ul>
              {getGlossaryToc(this.props.data).map((gls: { source: Source; section: Section }, i) => {
                return (
                  <li key={i}>
                    <a
                      href={`#${gls.source.id}`}
                      title={gls.source.lang.en}
                      onClick={() => this.handleClick(this.state.lang, gls.source.id)}
                    >
                      <div className="info">
                        {gls.source.date} / {gls.source.lang.ja}
                      </div>
                      {gls.section.lang.ja}
                    </a>
                  </li>
                )
              })}
            </ul>
            <div className="separator-small" />
            <div className="footer">
              TMdict: <a href="../en/">EN</a> | <a href="../ja/">JA</a> | <a href="../zh/">ZH</a>
            </div>
          </div>
        )
      } else {
        return (
          <div id="container">
            <div id="top">
              <div className="wrapper group">
                <h2>{this.props.data[this.state.glossary].source.lang[this.state.lang]}</h2>
                <div className="nav">
                  <div className="nav-info">
                    {this.props.data[this.state.glossary].source.date}
                    <br />
                    pp.
                    {this.props.data[this.state.glossary].section.page}:{' '}
                    {this.props.data[this.state.glossary].section.lang[this.state.lang]}
                    <br />
                  </div>
                  <div className="nav-lang">
                    <a
                      href={`#${this.props.data[this.state.glossary].source.id}`}
                      title="EN"
                      onClick={() => this.handleClick('en', this.state.glossary)}
                    >
                      English
                    </a>{' '}
                    |
                    <a
                      href={`#${this.props.data[this.state.glossary].source.id}`}
                      title="ZH"
                      onClick={() => this.handleClick('zh', this.state.glossary)}
                    >
                      中文
                    </a>{' '}
                    |
                    <a
                      href={`#${this.props.data[this.state.glossary].source.id}`}
                      title="JA"
                      onClick={() => this.handleClick('ja', this.state.glossary)}
                    >
                      日本語
                    </a>{' '}
                    |<a href="./">↵</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="wrapper">
              <div id="main">
                {this.props.data[this.state.glossary].gyo.map((jaIndex, i) => {
                  const entries = this.props.data[this.state.glossary].entries.hasOwnProperty(jaIndex.id)
                    ? this.props.data[this.state.glossary].entries[jaIndex.id]
                    : []
                  // Only render if there are entries under this index
                  if (entries.length !== 0) {
                    return (
                      <div key={i}>
                        <h3 id={jaIndex.id}>{jaIndex.name}</h3>
                        <br />
                        {entries
                          // Sort by the order entry appears in the book
                          .sort((a: BookGlossaryEntry, b: BookGlossaryEntry) => a.order - b.order)
                          .map((e: BookGlossaryEntry, j) => {
                            return (
                              <BookEntry
                                lang={this.state.lang}
                                data={e}
                                source={this.props.data[this.state.glossary].source.id}
                                section={this.props.data[this.state.glossary].section.id}
                                key={j}
                              />
                            )
                          })}
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </div>
        )
      }
    }
    return renderGlossary()
  }
}

ReactDOM.render(<Book data={glossary} />, document.getElementById('main'))

export default Book
