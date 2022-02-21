import * as React from 'react'

import { HTML_CONTENT, PAGE_TYPE } from '../constants'
import { BaseProps } from '../types'

import MainPage from './MainPage'
import Side from './Side'
import Top from './Top'

const Base = (props: BaseProps) => {
  const renderCss = () => {
    if (props.metadata.id === 'search') {
      return (
        <>
          <link rel="stylesheet" href="../src/vendor/tipuesearch/tipuesearch.css" />
        </>
      )
    } else {
      return null
    }
  }
  const renderScript = () => {
    if (props.metadata.id === 'index') {
      return (
        <>
          {/*<script src="../src/js/vendor.bundle.js"></script>*/}
          <script src="../src/js/app.bundle.js" />
        </>
      )
    } else if (props.metadata.id === 'search') {
      return (
        <>
          <script src="../src/vendor/jquery-3.3.1.min.js" />
          <script src="../src/vendor/tipuesearch/tipuesearch_set.js" />
          <script src="../src/vendor/tipuesearch/tipuesearch.min.js" />
          <script src="../src/js/search.data.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `$(document).ready(function() {
              $('#tipue_search_input').tipuesearch({
                'minimumLength': 2,
                'highlightTerms': true,
                'wholeWords': false,
              });
            });`,
            }}
          />
        </>
      )
    } else {
      return null
    }
  }
  const renderMain = () => {
    /**
     * Types of main content:
     * - Entry: Static HTML entry generated using glossary data
     * - Page: Static site-related pages
     */
    switch (props.metadata.type) {
      case PAGE_TYPE.entry: {
        return <MainPage main={props.main} metadata={props.metadata} lang={props.nav.pageLang} />
      }
      case PAGE_TYPE.page:
        return <div className="main-content" dangerouslySetInnerHTML={{ __html: props.main.content }} />
    }
  }
  return (
    <html>
      <head>
        <title>{props.main.title} | TMdict</title>
        <meta charSet={HTML_CONTENT.metaCharset} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://www.tmdict.com/${props.nav.pageLang}/${props.metadata.url}`} />
        <link rel="shortcut icon" href="../favicon.ico" />
        {renderCss()}
        <link rel="stylesheet" href="../src/css/style.min.css" />
      </head>
      <body>
        <div id="container">
          <div className="wrapper group">
            <Top top={props.top} metadata={props.metadata} nav={props.nav} />
            <div className="main">{renderMain()}</div>
            <Side side={props.side} metadata={props.metadata} nav={props.nav} />
          </div>
        </div>
      </body>
      {renderScript()}
    </html>
  )
}

export default Base
