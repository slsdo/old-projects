import * as fs from 'fs-extra'
import * as yaml from 'js-yaml'
import * as path from 'path'

import { DATA, DATA_SRC } from './constants'
import { extractNavIndex } from './dataParser'
import { Category, Content, Entry, EntrySingle, IdLanguage, Index, Page, Section, Source } from './types'

/**
 * Given a directory and YAML file name, load the file into memory
 */
const loadYaml = (dir: string, file: string): any => {
  const p = `${path.resolve(dir, file)}`
  const f: string = fs.readFileSync(p, 'utf8')
  return yaml.safeLoad(f)
}

/**
 * Converts a directory of YAML files into JSON
 *
 * @param dir YAML directory that is being processed
 * @returns An Object containing contents of all YAML files in the given dir
 */
export const loadYamlDir = (dir: string): any => {
  // Go through all YAML in a directory, parse each into json and join with accumulated object
  const reducer = (acc: object, f: string): any => {
    if (f.endsWith('.yml')) {
      const json = loadYaml(dir, f)
      // Combine YAML content and id/language data
      const combined = { [json.id]: json }
      return Object.assign(acc, combined)
    } else {
      // Not valid yaml
      return acc
    }
  }
  return fs.readdirSync(dir).reduce(reducer, {})
}

/**
 * A generic function that takes in a JSON data object gathered from many YAML
 * files and converts it to a data dictionary of type `T`
 *
 * @param json Raw data object from YAML file
 * @param extractor Extractor that converts the raw JSON to an object of type `T`
 * @returns Dictionary of type `[key: string] -> T`
 */
const extractData = <T>(json: any, extractor: (data: any) => T): { [key: string]: T } => {
  let acc: { [key: string]: T } = {}
  // Iterate through each object in the JSON
  for (const key in json) {
    // Skip loop if the property is from prototype
    if (!json.hasOwnProperty(key)) {
      continue
    }
    // Extract data from the JSON object
    const parsed: T = extractor(json[key])
    // Append extracted data to accumulator
    acc = Object.assign(acc, { [key]: parsed })
  }
  return acc
}

export const extractPage = (data: any): Page => {
  const id: string = data.id.split('.')[0]
  const lang: string = data.id.split('.')[1]
  return {
    content: data.content,
    id,
    lang,
  }
}

export const extractContent = (data: any): Content => {
  return {
    content: data.content,
    note: data.note,
  }
}

export const extractGlossary = (data: any): IdLanguage => {
  return {
    id: data.id,
    lang: {
      en: data.en,
      ja: data.ja,
      zh: data.zh,
    },
  }
}

export const glossaries: { [key: string]: IdLanguage } = extractData<IdLanguage>(
  loadYamlDir(DATA_SRC.glossary),
  extractGlossary
)

export const extractSection = (data: any): Section => {
  return {
    glossary: glossaries[data.glossary],
    id: data.id,
    lang: {
      en: data.en,
      ja: data.ja,
      zh: data.zh,
    },
    page: data.page,
  }
}

export const extractCategory = (data: any): Category => {
  return {
    // Assign if `duplicate` exists https://stackoverflow.com/a/50367186
    ... ('duplicate' === data.type) && { duplicate: data.duplicate }, 
    id: data.id,
    lang: {
      en: data.en,
      ja: data.ja,
      zh: data.zh,
    },
    type: data.type,
  }
}

export const categories: { [key: string]: Category } = extractData<Category>(
  loadYamlDir(DATA_SRC.category),
  extractCategory
)

export const extractSource = (data: any): Source => {
  const sections: { [key: string]: Section } = extractData<Section>(data.sections, extractSection)
  return {
    date: data['release-date'],
    id: data.id,
    lang: {
      en: data.en,
      ja: data.ja,
      zh: data.zh,
    },
    sections,
  }
}

export const sources: { [key: string]: Source } = extractData<Source>(loadYamlDir(DATA_SRC.source), extractSource)

export const extractEntry = (data: any): Entry => {
  // Extract navigation data
  const navIndex: Index = extractNavIndex(data)
  // Extract entry data
  const entries: EntrySingle[] = []
  for (const entry of data.entry) {
    const e: EntrySingle = {
      category: entry.category.map((key: string) => {
        // If duplicate, replace with parent label but keep alt label
        if ('duplicate' === categories[key].type) {
          return {
            altLabel: categories[key].lang,
            id: categories[categories[key].duplicate].id,
            lang: categories[categories[key].duplicate].lang,
            type: categories[key].type,
          }
        }
        return categories[key]
      }),
      content: {
        en: extractContent(entry.en),
        ja: extractContent(entry.ja),
        zh: extractContent(entry.zh),
      },
      img: entry.img,
      order: entry.order,
      section: sources[entry.source].sections[entry.section],
      source: sources[entry.source],
    }
    entries.push(e)
  }
  // Put everything together
  return {
    entries,
    furigana: data.furigana,
    id: data.id,
    index: navIndex,
    title: {
      en: data.title.en,
      ja: data.title.ja,
      zh: data.title.zh,
    },
  }
}

export const pageData: { [key: string]: Page } = extractData<Page>(loadYamlDir(DATA_SRC.page), extractPage)

export const entryData: { [key: string]: Entry } = extractData<Entry>(loadYamlDir(DATA_SRC.entry), extractEntry)

/**
 * Generate sitemap
 */
export const generateSitemap = (dist: string): void => {
  const urls: any[] = []
  // Go through each language directory and generate sitemap url based on files
  for (const lang of DATA.common.language) {
    try {
      fs.readdirSync(`${dist}/${lang}`).map(f => {
        if (f.endsWith('.html')) {
          const url: string =
            f.search('index.html') !== -1
              ? `https://www.tmdict.com/${lang}/${f.substr(0, f.search('index.html'))}` // If index.html, remove `index.html`
              : `https://www.tmdict.com/${lang}/${f.slice(0, -5)}` // else just remove `.html` extension
          urls.push({
            changefreq: 'monthly',
            lastmodfile: `${dist}/${lang}/${f}`,
            lastmodrealtime: true,
            priority: 1.0,
            url,
          })
        }
      })
    } catch (err) {
      console.log(`Error reading dir ./dist/${lang}: ${err}`)
    }
  }
  const sitemap = require('sitemap').createSitemap({
    hostname: 'https://www.tmdict.com',
    urls,
  })
  // Write sitemap to file
  fs.outputFile(`${dist}/sitemap.xml`, sitemap, (err: any) => {
    if (err) {
      return console.log(err)
    }
  })
}
