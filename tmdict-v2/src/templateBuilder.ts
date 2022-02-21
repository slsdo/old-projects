import { APP } from './constants'
import { getEntryCategory } from './dataParser'
import { Category, Entry, IdLanguage, NavState, Notes } from './types'

/**
 * Prepare entry notes object
 */
export const getEntryNotes = (
  note: { [key: string]: string },
  source: string,
  section: string,
  entry: string,
  order: number
): Notes[] => {
  return Object.keys(note).map((key, i) => {
    // Use first letter of source + section and entry order/id/length to create notes ID key
    const idHash: string = `${source}-${section}`
      .split('-')
      .map(s => s.charAt(0))
      .join('')
      .concat(`-${order}${entry[0]}${entry.length}${entry.slice(-1)}`)
    return {
      content: note[key],
      id: `${idHash}-n${i + 1}`,
      index: i + 1,
      pattern: `{{n${i + 1}}}`,
    }
  })
}

/**
 * Check if given list of item is active
 */
export const isActive = (cond: boolean): string => (cond ? 'active' : '')

/**
 * Filter entry content to parse all things such as replacing notes key with formatted links
 */
export const filterEntryContent = (rawContent: string, notes: Notes[], missing: string, contribute: string): string => {
  return (
    '<p>' +
    notes
      .reduce((content: string, note: Notes): string => {
        // Render all content notes
        return content.replace(
          new RegExp(note.pattern, 'g'),
          `<sup id="${note.id}s" class="note"><a title="${note.id}s" href="#${note.id}">${note.index}</a></sup>`
        )
      }, rawContent)
      .replace(
        // Render `missing` tags
        new RegExp('{{missing}}', 'g'),
        `<span id="contact" class="contact"><a href="../contact/">!missing${missing}</a></span>`
      )
      .replace(
        // Render `contribute` tags
        new RegExp('{{proofread}}', 'g'),
        `<span id="contact" class="contact"><a href="../contact/">!proofreading needed${contribute}</a></span>`
      )
      // Replace newlines with <br> tags
      .replace(/(?:\r\n|\r|\n)/g, '<br>') +
    '</p>'
  )
}

/**
 * Render entry page category based on their type
 */
export const renderEntryMainCategory = (cat: Category[], lang: string): string => {
  return cat
    .map(c => {
      switch (c.type) {
        case 'common':
          return `<a href="./#ja+cat.${c.id}">${c.lang[lang]}</a>`
        case 'duplicate':
          return `<a href="./#ja+cat.${c.id}">${c.altLabel[lang]}</a>`
        case 'unique':
          return c.lang[lang]
        default:
          return ''
      }
    })
    .join(' · ')
}

/**
 * Combine an entry's category, get rid of duplicates and append `/` after each category if there are multiple
 */
export const renderEntrySideCategory = (entry: Entry, lang: string): string => {
  return getEntryCategory(entry)
    .map(cat => cat.lang[lang])
    .join('/')
}

export const renderNavUrl = (nav: NavState, navIndex: string, type?: string, filter?: string): string => {
  const currentCat = nav.filterCat === '' ? '' : `+cat.${nav.filterCat}`
  const currentSrc = nav.filterSrc === '' ? '' : `+src.${nav.filterSrc}`
  const dot = navIndex === '' ? '' : `.${navIndex}`
  switch (type) {
    case APP.src:
      return `#${nav.navLang}${dot}${filter === '' ? '' : `+src.${filter}`}${currentCat}`
    case APP.cat:
      return `#${nav.navLang}${dot}${currentSrc}${filter === '' ? '' : `+cat.${filter}`}`
    case APP.en:
      return `../${nav.pageLang}/#en${dot}${currentSrc}${currentCat}`
    case APP.ja:
      return `../${nav.pageLang}/#ja${dot}${currentSrc}${currentCat}`
    default:
      return `#${nav.navLang}${dot}${currentSrc}${currentCat}`
  }
}

/**
 * Render content (category, glossary) for App filterlist main page
 */
export const renderAppContent = (content: IdLanguage[], separator: string, lang: string): string => {
  const contents: string[] = content.reduce(
    (acc: string[], item: IdLanguage): string[] => acc.concat(item.lang[lang]),
    []
  )
  return contents.filter((ctn: string, index: number, arr: string[]) => index === arr.indexOf(ctn)).join(separator)
}
