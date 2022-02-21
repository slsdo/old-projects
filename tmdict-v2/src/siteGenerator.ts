import * as fs from 'fs-extra'
import { html_beautify } from 'js-beautify'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

import { DATA, DATA_SRC, HTML_CONTENT, PATHS } from './constants'
import { getEntryBaseProps, getEntryListSingle, getEntrySidebarData, getPageBaseProps } from './dataParser'
import { entryData, generateSitemap, pageData } from './fileLoader'
import { BaseProps, BookGlossary, BookGlossaryEntry, Entry, EntryList, NameId, Search } from './types'

import Base from './components/Base'

/**
 * Prettify HTML, remove newlines before <br> and <span>
 */
const formatHtml = (html: string): string => {
  return html_beautify(html, {
    end_with_newline: true,
    extra_liners: [],
    unformatted: ['br', 'span'],
  })
}

/**
 * Generate HTML using React
 */
const renderHtml = (props: BaseProps, pretty = true): string => {
  const html: string = HTML_CONTENT.doctype + ReactDOMServer.renderToStaticMarkup(React.createElement(Base, props))
  return pretty ? formatHtml(html) : html
}

/**
 * @param content Content to be written to output file
 * @param path Directory + filename of output file
 */
const outputFile = (content: string, path: string): void => {
  fs.outputFile(path, content, (err: Error) => {
    if (err) {
      return console.log(err)
    }
  })
}

export default class SiteGenerator {
  /**
   * Generates all static HTML files from various sources
   */
  buildHtml = (hasExt: boolean): void => {
    console.log(`HTML ENV: ${hasExt ? 'development' : 'production'}`)
    this.buildHtmlEntry(hasExt)
    this.buildHtmlStatic(hasExt)
  }

  /**
   * Generates all static HTML site pages
   */
  buildHtmlEntry = (hasExt: boolean): void => {
    console.log('HTML entries: building...')
    for (const lang of DATA.common.language) {
      for (const key of Object.keys(entryData)) {
        const url = `${entryData[key].index.ja.id}.${entryData[key].id}`
        const sidebarContent: { [key: string]: Entry[] } = getEntrySidebarData(entryData)
        const baseProps: BaseProps = getEntryBaseProps(entryData[key], sidebarContent, hasExt, lang)
        const html: string = renderHtml(baseProps)
        // Write to HTML file
        outputFile(html, `${PATHS.out}/${lang}/${url}.html`)
      }
    }
    console.log('HTML entries: success!')
  }

  /**
   * Generates all static HTML pages
   */
  buildHtmlStatic = (hasExt: boolean): void => {
    console.log('HTML static pages: building...')
    for (const key of Object.keys(pageData)) {
      const baseProps: BaseProps = getPageBaseProps(pageData[key], hasExt)
      const html: string = renderHtml(baseProps)
      // Write to HTML file
      outputFile(html, `${PATHS.out}/${pageData[key].lang}/${pageData[key].id}.html`)
    }
    console.log('HTML static pages: success!')
  }

  /**
   * Generate data to be used by site and app
   */
  buildData = (hasExt: boolean): void => {
    console.log(`Data ENV: ${hasExt ? 'development' : 'production'}`)
    this.buildAppData()
    this.buildAppMainContentData()
    this.buildSearchData(hasExt)
    this.buildBookData()
  }

  /**
   * Generate data to be used by filterlist app
   */
  buildAppData = (): void => {
    console.log('App data: building...')
    const entryList: EntryList[] = []
    for (const key of Object.keys(entryData)) {
      entryList.push(getEntryListSingle(entryData[key]))
    }
    const entryListData = 'export const dict = ' + JSON.stringify(entryList)
    outputFile(entryListData, `${PATHS.outAppData}/dict.ts`)
    console.log('App data: success!')
  }

  /**
   * Generate data to be used by filterlist app
   */
  buildAppMainContentData = (): void => {
    console.log('App MainContent data: building...')
    const mainContent: { [key: string]: string } = {}
    for (const lang of DATA.common.language) {
      const content: string = pageData[`index.${lang}`].content
      mainContent[lang] = content
    }
    const mainContentData = 'export const content: any = ' + JSON.stringify(mainContent)
    outputFile(mainContentData, `${PATHS.outAppData}/content.ts`)
    console.log('App MainContent data: success!')
  }

  /**
   * Generate data to be used by Tipue search
   */
  buildSearchData = (hasExt: boolean): void => {
    console.log('Search data: building...')
    const searchData: Search[] = []
    const ext: string = hasExt ? '.html' : ''
    for (const lang of DATA.common.language) {
      for (const key of Object.keys(entryData)) {
        const bookEntry: Search = {
          text: entryData[key].entries.map(e => e.content[lang].content).join(' '),
          title: entryData[key].title[lang],
          url: `https://www.tmdict.com/${lang}/${entryData[key].index.ja.id}.${entryData[key].id}${ext}`,
        }
        searchData.push(bookEntry)
      }
    }
    const searchDataOut = 'var tipuesearch = ' + JSON.stringify({ pages: searchData })
    outputFile(searchDataOut, `${PATHS.outSrc}/js/search.data.js`)
    console.log('Search data: success!')
  }

  /**
   * Generate data to be used by books
   */
  buildBookData = (): void => {
    console.log('Book data: building...')
    const bookData: BookGlossary = {}
    const gyoData: NameId[] = []
    // Get all JA index infor
    for (const key of Object.keys(DATA.gyo)) {
      gyoData.push(DATA.gyo[key])
    }
    // Get all entries
    for (const key of Object.keys(entryData)) {
      entryData[key].entries.map(e => {
        const bookEntry: BookGlossaryEntry = {
          category: e.category,
          content: e.content,
          furigana: entryData[key].furigana,
          id: entryData[key].id,
          img: e.img,
          index: entryData[key].index,
          order: e.order,
          title: entryData[key].title,
        }
        bookData.hasOwnProperty(e.source.id)
          ? bookData[e.source.id].entries.hasOwnProperty(bookEntry.index.gyo.id)
            ? bookData[e.source.id].entries[bookEntry.index.gyo.id].push(bookEntry)
            : (bookData[e.source.id].entries[bookEntry.index.gyo.id] = [bookEntry])
          : (bookData[e.source.id] = {
              entries: { [bookEntry.index.gyo.id]: [bookEntry] },
              gyo: gyoData,
              section: e.section,
              source: e.source,
            })
      })
    }
    outputFile(`export const glossary = ${JSON.stringify(bookData)}`, `${PATHS.outAppData}/book.ts`)
    console.log('Book data: success!')
  }

  /**
   * Copy static assets from `source` dir to `output` dir
   */
  buildStaticAssets = (): void => {
    console.log('Static assets: building...')
    fs.ensureDir(PATHS.out)
      .then(() => {
        fs.copy(PATHS.srcStaticAssets, PATHS.out)
          .then(() => console.log('Static assets: success!'))
          .catch(err => console.error(`Static assets: error: ${err}`))
      })
      .catch(err => {
        console.error(`Static assets: ensureDir error: ${err}`)
      })
  }

  /**
   * Copy static assets from `data/img` dir to `output` dir
   */
  buildDataImg = (): void => {
    console.log('Data img: building...')
    fs.ensureDir(`${PATHS.outSrc}/img/dict`)
      .then(() => {
        fs.copy(DATA_SRC.img, `${PATHS.outSrc}/img/dict`)
          .then(() => console.log('Data img: success!'))
          .catch(err => console.error(`Data img: error: ${err}`))
      })
      .catch(err => {
        console.error(`Data img: ensureDir error: ${err}`)
      })
  }

  /**
   * Generate sitemap
   */
  buildSitemap = (): void => {
    console.log('Generating sitemap: building...')
    generateSitemap(PATHS.out)
    console.log('Generating sitemap: success!')
  }
}

export const siteGenerator = new SiteGenerator()
