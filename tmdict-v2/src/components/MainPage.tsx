import * as React from 'react'

import { entryData } from '../fileLoader'
import { filterEntryContent, getEntryNotes, renderEntryMainCategory } from '../templateBuilder'
import { EntrySingle, MainProps, Metadata, Notes } from '../types'

interface Props {
  main: MainProps
  metadata: Metadata
  lang: string
}

const MainPage = (props: Props) => {
  return (
    <div className="main-content">
      {/* Title and entry metadata */}
      <div className="entry-header group">
        <div className="entry-title">{props.main.title}</div>
        <div className="permalink">
          <a title={props.metadata.common.link} href={`../${props.lang}/${props.metadata.url}${props.metadata.ext}`}>
            #
          </a>
        </div>
        <div id="contact" className="contact">
          <a href="../contact/">{props.metadata.common.report}</a>
        </div>
      </div>
      {/* Go through each entry's individual content */}
      {entryData[props.metadata.id].entries.map((e: EntrySingle, i) => {
        // Prepare Notes object
        const notes: Notes[] = getEntryNotes(
          e.content[props.lang].note,
          e.source.id,
          e.section.id,
          props.metadata.id,
          e.order
        )
        return (
          <React.Fragment key={i}>
            <div className="group">
              {/* Category */}
              {i > 0 ? <div className="section">&sect;</div> : null}
              {e.category[0].type !== 'none' ? (
                <div
                  className={'entry-category' + (e.category[0].type === 'unique' ? ' uniq' : '')}
                  dangerouslySetInnerHTML={{
                    __html: renderEntryMainCategory(e.category, props.lang),
                  }}
                />
              ) : null}
              {/* Content (with formatted notes links) */}
              <div
                className="entry-content"
                dangerouslySetInnerHTML={{
                  __html: filterEntryContent(
                    e.content[props.lang].content,
                    notes,
                    `・${props.metadata.common.missing}`,
                    `・${props.metadata.common.contribute}`
                  ),
                }}
              />
              {/* Image */}
              {e.img && (
                <div className="entry-image">
                  <img title={props.main.title} src={'../src/img/dict/' + e.img} alt={e.img} />
                </div>
              )}
              {/* Notes */}
              {notes.length === 0 ? null : (
                // Format Editor's Notes at the bottom of the page
                <div className="entry-note">
                  <h5>{props.metadata.common.notes}</h5>
                  <ol>
                    {notes.map((note, j) => {
                      return (
                        <div className="group" key={j}>
                          <li id={note.id}>
                            <a title={note.id} href={`#${note.id}s`}>
                              ^
                            </a>{' '}
                            <span dangerouslySetInnerHTML={{ __html: note.content }} />
                          </li>
                        </div>
                      )
                    })}
                  </ol>
                </div>
              )}
              {/* Source */}
              <div className="entry-source">
                <a href={'./#ja+src.' + e.source.id}>
                  {e.source.lang[props.lang]}: {e.section.lang[props.lang]}
                </a>
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default MainPage
