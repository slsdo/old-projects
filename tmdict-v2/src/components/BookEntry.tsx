import * as React from 'react'

import { filterEntryContent, getEntryNotes } from '../templateBuilder'
import { BookGlossaryEntry, Notes } from '../types'

export interface BookEntryProps {
  data: BookGlossaryEntry
  lang: string
  source: string
  section: string
}

export interface BookEntryState {
  lang: string
}

class BookEntry extends React.Component<BookEntryProps, BookEntryState> {
  constructor(props: BookEntryProps) {
    super(props)
    this.state = {
      lang: props.lang,
    }
  }
  componentDidUpdate(prevProps: BookEntryProps) {
    if (this.props.lang !== prevProps.lang) {
      this.setState({
        lang: this.props.lang,
      })
    }
  }
  handleClick(lang: string) {
    this.setState({
      lang,
    })
  }
  render() {
    const notes: Notes[] = getEntryNotes(
      this.props.data.content[this.state.lang].note,
      this.props.source,
      this.props.section,
      this.props.data.id,
      this.props.data.order
    )
    const filteredContent: string = filterEntryContent(this.props.data.content[this.state.lang].content, notes, '', '')
    return (
      <div className="entry" id={this.props.data.id}>
        <div className="entry-header group">
          <div className="entry-title">{this.props.data.title[this.state.lang]}</div>
          <div className="permalink">
            <a href={`#${this.props.data.id}`} title={this.props.data.id}>
              #
            </a>
          </div>
        </div>

        <div className="entry-lang">
          <a className={this.state.lang === 'en' ? 'active' : ''} onClick={this.handleClick.bind(this, 'en')}>
            EN
          </a>{' '}
          ・
          <a className={this.state.lang === 'zh' ? 'active' : ''} onClick={this.handleClick.bind(this, 'zh')}>
            中
          </a>{' '}
          ・
          <a className={this.state.lang === 'ja' ? 'active' : ''} onClick={this.handleClick.bind(this, 'ja')}>
            日
          </a>
        </div>

        <div className="entry-main group">
          <div className="entry-category">{this.props.data.category.map(c => {
            return (c.type === 'duplicate') ? c.altLabel[this.state.lang] : c.lang[this.state.lang]
          }).join('/')}</div>
          <div className="entry-content" dangerouslySetInnerHTML={{ __html: filteredContent }} />
        </div>

        {notes.length === 0 ? null : (
          <div className="group">
            <div className="entry-note">
              <ol>
                {notes.map((note, i) => {
                  return (
                    <li id={note.id} key={i}>
                      <a title={note.id} href={`#${note.id}s`}>
                        ^
                      </a>{' '}
                      <span dangerouslySetInnerHTML={{ __html: note.content }} />
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        )}

        {this.props.data.img === '' ? (
          ''
        ) : (
          <div className="group">
            <div className="entry-image">
              <img
                title={this.props.data.title[this.state.lang]}
                src={'../src/img/dict/' + this.props.data.img}
                alt={this.props.data.img}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BookEntry
