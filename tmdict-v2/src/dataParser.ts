import { APP, DATA, PAGE_TYPE } from './constants'
import {
  BaseProps,
  Category,
  Entry,
  EntryList,
  EntrySingle,
  IdLanguage,
  Index,
  MainProps,
  Metadata,
  NameId,
  NavState,
  Page,
  PageCommon,
  SideProps,
  TopProps,
} from './types'

export const extractIndex = (data: any): NameId => {
  return {
    id: data.id,
    name: data.name,
  }
}

export const extractNavIndex = (data: any): Index => {
  return {
    en: extractIndex(DATA.en[data.en]),
    gyo: extractIndex(DATA.gyo[DATA.ja[data.ja].gyo]),
    ja: extractIndex(DATA.ja[data.ja]),
  }
}

/**
 * Combine all of an entry's category and get rid of duplicates
 */
export const getEntryCategory = (entry: Entry): Category[] => {
  const categories: Category[] = entry.entries.reduce(
    (acc: Category[], e: EntrySingle): Category[] => acc.concat(e.category),
    []
  )
  return categories.filter((cat: Category, index: number, arr: Category[]) => {
    return index === arr.map(c => c.id).indexOf(cat.id)
  })
}

/**
 * Process an entry to be used used by the filter app
 */
export const getEntryListSingle = (entry: Entry): EntryList => {
  return {
    category: getEntryCategory(entry).map(cat => {
      return {
        id: cat.id,
        lang: {
          en: cat.lang.en,
          ja: cat.lang.ja,
          zh: cat.lang.zh,
        },
        type: cat.type,
      }
    }),
    furigana: entry.furigana,
    glossary: entry.entries.map(e => {
      return {
        id: e.section.id,
        lang: {
          en: e.section.glossary.lang.en,
          ja: e.section.glossary.lang.ja,
          zh: e.section.glossary.lang.zh,
        },
      }
    }),
    index: entry.index,
    source: entry.entries.map(e => {
      return {
        id: e.source.id,
        lang: {
          en: e.source.lang.en,
          ja: e.source.lang.ja,
          zh: e.source.lang.zh,
        },
      }
    }),
    title: {
      id: entry.id,
      lang: {
        en: entry.title.en,
        ja: entry.title.ja,
        zh: entry.title.zh,
      },
    },
  }
}

/**
 * Checks if current render requires `.html` extention, as well as if
 * the extention is for `index.html`
 *
 * @param hasExt If `.html` is required
 * @param isIndex If extension is for `index.html`
 * @returns String representation of the extension, empty if no extension
 */
export const getHtmlExtension = (hasExt: boolean, isIndex = false): string => {
  return hasExt ? (isIndex ? 'index.html' : '.html') : ''
}

/**
 * @param data Object containing all indices of a given language
 * @param all Select-all option for the given language
 */
export const getTopNav = (data: any, all: string): NameId[] => {
  // For each index object, extract `id` and `name`, then combine with `all`
  return Object.keys(data)
    .map(id => extractIndex(data[id]))
    .concat({
      id: '',
      name: all,
    })
}

/**
 * Returns an object with all data needed to generate a HTML page's top section
 */
export const getTopProps = (): TopProps => {
  return {
    enNav: getTopNav(DATA.en, 'all'),
    jaNav: getTopNav(DATA.gyo, '全'),
  }
}

export const getPageCommon = (lang: string): PageCommon => {
  return {
    about: DATA.common.about[lang],
    book: DATA.common.book[lang],
    contribute: DATA.common.contribute[lang],
    index: DATA.common.index[lang],
    language: DATA.common.language,
    link: DATA.common.link[lang],
    misc: DATA.common.misc[lang],
    missing: DATA.common.missing[lang],
    notes: DATA.common.notes[lang],
    report: DATA.common.report[lang],
    return: DATA.common.return[lang],
    search: DATA.common.search[lang],
    side: DATA.common.side[lang],
    site: DATA.common.site[lang],
    version: DATA.common.version,
  }
}

export const getMetadata = (
  lang: string,
  type: string,
  hasExt: boolean,
  id: string = '',
  url: string = '',
  returnUrl: string = './' + getHtmlExtension(hasExt, hasExt)
): Metadata => {
  return {
    common: getPageCommon(lang),
    ext: getHtmlExtension(hasExt),
    extIndex: getHtmlExtension(hasExt, hasExt),
    id,
    returnUrl,
    type,
    url,
  }
}

export const getNav = (
  lang: string = '',
  nlang: string = '',
  idx: string = '',
  src: string = '',
  cat: string = ''
): NavState => {
  return {
    filterCat: cat,
    filterSrc: src,
    navIndex: idx,
    navLang: nlang,
    pageLang: lang,
  }
}

export const getPageBaseProps = (data: Page, hasExt: boolean): BaseProps => {
  const topProps: TopProps = getTopProps()
  const mainProps: MainProps = {
    content: data.content,
    title: DATA.common[data.id][data.lang],
  }
  const sideProps: SideProps = {
    content: [], // Static page side content is in metadata.side
    title: DATA.common[data.id].en.substring(1),
    titleTop: DATA.common[data.id].en[0],
  }
  return {
    main: mainProps,
    metadata: getMetadata(
      data.lang,
      PAGE_TYPE.page,
      hasExt,
      data.id, // id
      data.id // url
    ),
    nav: getNav(data.lang),
    side: sideProps,
    top: topProps,
  }
}

export const getEntryBaseProps = (
  data: Entry,
  sidebar: { [key: string]: Entry[] },
  hasExt: boolean,
  lang: string
): BaseProps => {
  const topProps: TopProps = getTopProps()
  const mainProps: MainProps = {
    content: '', // Entry page content comes from entryData
    title: data.title[lang],
  }
  const sideProps: SideProps = {
    content: sidebar[data.index.ja.id],
    title: '', // Entry page sidebar title is just its hiragana
    titleTop: data.index.ja.name,
  }
  return {
    main: mainProps,
    metadata: getMetadata(
      lang,
      PAGE_TYPE.entry,
      hasExt,
      data.id, // id
      `${data.index.ja.id}.${data.id}`, // url
      `./${getHtmlExtension(hasExt, hasExt)}#ja.${data.index.gyo.id}` // return url
    ),
    nav: getNav(lang, 'ja', data.index.gyo.id),
    side: sideProps,
    top: topProps,
  }
}

export const getAppBaseProps = (lang: string, hasExt: boolean): BaseProps => {
  return {
    main: {
      content: '',
      title: 'Glossary',
    },
    metadata: getMetadata(lang, PAGE_TYPE.app, hasExt),
    nav: getNav(),
    side: {
      content: [], // Static page side content is in metadata.side
      title: 'ome',
      titleTop: 'H',
    },
    top: getTopProps(),
  }
}

/**
 * A map of hiragana -> collection of Entry used to generate entry page sidebar content
 */
export const getEntrySidebarData = (entryData: { [key: string]: Entry }): { [key: string]: Entry[] } => {
  const entryByHiragana: { [key: string]: Entry[] } = {}
  // Goe through each entry and add it by its hiragana
  for (const key of Object.keys(entryData)) {
    const hiragana = entryData[key].index.ja.id
    // If first time seeing hiragana, create array first
    entryByHiragana.hasOwnProperty(hiragana)
      ? entryByHiragana[hiragana].push(entryData[key])
      : (entryByHiragana[hiragana] = [entryData[key]])
  }
  // Sort by hiragana, then furigana
  for (const key of Object.keys(entryByHiragana)) {
    entryByHiragana[key].sort((a: Entry, b: Entry) => {
      return a.index.ja.name.localeCompare(b.index.ja.name) || a.furigana.localeCompare(b.furigana)
    })
  }
  return entryByHiragana
}

/**
 * Get list of index for main page
 *
 * @param lang Current navigation language
 * @param idx Current navigation index, if '' then display all
 */
export const getFilterListIndex = (lang: string, idx: string): NameId[] => {
  if (lang === APP.en) {
    return idx === '' ? Object.keys(DATA.en).map(id => DATA.en[id]) : [DATA.en[idx]]
  } else if (lang === APP.ja) {
    return idx === '' ? Object.keys(DATA.gyo).map(id => DATA.gyo[id]) : [DATA.gyo[idx]]
  }
}

/**
 * Check if the given entry satisfy the given source and category filter
 */
export const filterSrcAndCat = (entry: EntryList, src: string, cat: string): boolean => {
  const filterSrc: boolean = src === '' ? true : entry.source.map(s => s.id).indexOf(src) > -1
  const filterCat: boolean = cat === '' ? true : entry.category.map(s => s.id).indexOf(cat) > -1
  return filterSrc && filterCat
}

/**
 * Get list of entries based on current navigation filter
 */

export const getFilterList = (
  dict: EntryList[],
  currentIndex: string,
  navLang: string,
  src: string,
  cat: string
): EntryList[] => {
  if (navLang === APP.en) {
    // Sort by English title
    return dict
      .filter(entry => {
        return entry.index.en.id === currentIndex && filterSrcAndCat(entry, src, cat)
      })
      .sort((a: EntryList, b: EntryList) => a.title.lang.en.localeCompare(b.title.lang.en))
  } else if (navLang === APP.ja) {
    // Sort by furigana, then hiragana
    return dict
      .filter(entry => {
        return entry.index.gyo.id === currentIndex && filterSrcAndCat(entry, src, cat)
      })
      .sort((a: EntryList, b: EntryList) => {
        return a.index.ja.name.localeCompare(b.index.ja.name) || a.furigana.localeCompare(b.furigana)
      })
  }
  // Something went wrong!
  console.log('No data!')
  return []
}

/**
 * Get list of sources or categories for sidebar to use as filter
 */
export const getSideFilter = (type: string, dict: EntryList[]): IdLanguage[] => {
  const reducer = ((t: string) => {
    switch (t) {
      case APP.src:
        return (acc: IdLanguage[], e: EntryList): IdLanguage[] => acc.concat(e.source)
      case APP.cat:
        return (acc: IdLanguage[], e: EntryList): IdLanguage[] =>
          // Filter out non-common categories
          e.category.find((c) => c.type !== "common" && c.type !== "duplicate")
            ? acc
            : acc.concat(e.category)
    }
  })(type)
  // Get all items from dict, remove duplicates, then sort
  return dict
    .reduce(reducer, [])
    .filter((item: IdLanguage, index: number, arr: IdLanguage[]) => index === arr.map(i => i.id).indexOf(item.id))
    .sort((a: IdLanguage, b: IdLanguage) => a.id.localeCompare(b.id))
}
