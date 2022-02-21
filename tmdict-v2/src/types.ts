/** Site React component props */

export interface BaseProps {
  main: MainProps
  metadata: Metadata
  nav: NavState
  side: SideProps
  top: TopProps
}

export interface TopProps {
  enNav: NameId[]
  jaNav: NameId[]
}

export interface MainProps {
  content: string
  title: string
}

export interface SideProps {
  content: Entry[]
  title: string
  titleTop: string
}

/** App data */

export interface NavState {
  filterCat: string
  filterSrc: string
  navIndex: string
  navLang: string
  pageLang: string
}

export interface EntryList {
  category: IdLanguage[]
  furigana: string
  glossary: IdLanguage[]
  index: Index
  source: IdLanguage[]
  title: IdLanguage
}

/** Site content */

export interface NameId {
  id: string
  name: string
}

export interface IdLanguage {
  id: string
  lang: Language
  type?: string
}

export interface Language {
  [key: string]: string
}

export interface Page {
  content: string
  id: string
  lang: string
}

export interface Metadata {
  common: PageCommon
  ext: string
  extIndex: string
  id: string
  returnUrl: string
  type: string
  url: string
}

export interface PageCommon {
  about: string
  book: string
  contribute: string
  index: string
  language: string[]
  link: string
  misc: string
  missing: string
  notes: string
  report: string
  return: string
  search: string
  side: string
  site: string
  version: string
}

export interface Changelog {
  date: string
  log: {
    [key: string]: ChangelogEntry
  }
  version: string
}

export interface ChangelogEntry {
  log: string
  summary: string
}

export interface Search {
  text: string
  title: string
  url: string
}

/** Glossary entry */

export interface Entry {
  entries: EntrySingle[]
  furigana: string
  id: string
  index: Index
  title: Language
}

export interface Index {
  en: NameId
  gyo: NameId
  ja: NameId
}

export interface EntrySingle {
  category: Category[]
  content: {
    [key: string]: Content
  }
  img: string
  order: number
  section: Section
  source: Source
}

export interface Content {
  content: string
  note: {
    [key: string]: string
  }
}

export interface Category {
  altLabel?: Language
  duplicate?: string
  id: string
  lang: Language
  type: string
}

export interface Source {
  date: string
  id: string
  lang: Language
  sections: {
    [key: string]: Section
  }
}

export interface Section {
  glossary: IdLanguage
  id: string
  lang: Language
  page: string
}

export interface Notes {
  content: string
  id: string
  index: number
  pattern: string
}

/** Book data */

export interface BookGlossary {
  [key: string]: {
    entries: {
      [key: string]: BookGlossaryEntry[]
    }
    section: Section
    source: Source
    gyo: NameId[]
  }
}

export interface BookGlossaryEntry {
  category: Category[]
  content: {
    [key: string]: Content
  }
  furigana: string
  id: string
  img: string
  index: Index
  order: number
  title: Language
}
