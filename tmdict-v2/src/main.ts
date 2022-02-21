import * as program from 'commander'
import * as process from 'process'

import { siteGenerator } from './siteGenerator'

program
  .version('2.0.0')
  .option('-a, --asset', 'Build static assets')
  .option('-h, --html [env]', 'Build HTML pages')
  .option('-d, --data [env]', 'Generate data')
  .option('-s, --sitemap', 'Generate sitemap')
  .parse(process.argv)

if (program.asset) {
  siteGenerator.buildStaticAssets()
  siteGenerator.buildDataImg()
}
if (program.sitemap) {
  siteGenerator.buildSitemap()
}
if (program.html) {
  siteGenerator.buildHtml(program.html !== 'production')
}
if (program.data) {
  siteGenerator.buildData(program.data !== 'production')
}
