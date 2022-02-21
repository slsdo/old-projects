import page from 'page'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { getAppBaseProps } from '../dataParser'
import { BaseProps, NavState } from '../types'

import MainApp from './MainApp'
import Side from './Side'
import Top from './Top'

const nav = {
  filterCat: '',
  filterSrc: '',
  navIndex: '',
  navLang: '',
  pageLang: '',
}

class App extends React.Component<BaseProps, NavState> {
  constructor(props: BaseProps) {
    super(props)
    this.state = { ...nav }
  }
  componentDidMount() {
    // Prepare router state
    page('/:lang/*', ctx => {
      const regexNav = ctx.hash.match(/^([\w]*\.?[a-zA-Z_]*)/)
      const regexCat = ctx.hash.match(/\scat\.([a-zA-Z0-9-_]*)/)
      const regexSrc = ctx.hash.match(/\ssrc\.([a-zA-Z0-9-_]*)/)
      const isJa = regexNav[1].match(/^ja.[_kstnhmyrw]|^ja$/) !== null
      const isEn = regexNav[1].match(/^en.[a-zA-Z_]$|^en$/) !== null
      nav.pageLang = ctx.params.lang
      if (regexNav !== null && (isJa || isEn)) {
        nav.navLang = regexNav[1].split('.')[0]
        nav.navIndex = regexNav[1].split('.')[1] !== undefined ? regexNav[1].split('.')[1] : ''
        nav.filterCat = regexCat !== null ? regexCat[1] : ''
        nav.filterSrc = regexSrc !== null ? regexSrc[1] : ''
      }
      this.setState({ ...nav })
    })
    // Start listening to change
    page({ click: false })
  }
  render() {
    return (
      <div className="wrapper group">
        <Top top={this.props.top} metadata={this.props.metadata} nav={this.state} />
        <MainApp main={this.props.main} metadata={this.props.metadata} nav={this.state} />
        <Side side={this.props.side} metadata={this.props.metadata} nav={this.state} />
      </div>
    )
  }
}

ReactDOM.render(
  <App {...getAppBaseProps(window.location.pathname.split('/')[1], process.env.NODE_ENV !== 'production')} />,
  document.getElementById('container')
)

export default App
