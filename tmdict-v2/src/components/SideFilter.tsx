import * as React from 'react'

import { getSideFilter } from '../dataParser'
import { renderNavUrl } from '../templateBuilder'
import { NavState } from '../types'
import { dict } from './data/dict'

interface Props {
  nav: NavState
  name: string
  filter: string
}

const SideFilter = (props: Props) => {
  return (
    <ul>
      <li className={props.filter === '' ? 'active' : ''}>
        <a href={renderNavUrl(props.nav, props.nav.navIndex, props.name, '')} title="all">
          <div className="entry group">
            <div className={`entry-${props.name}`}>all</div>
          </div>
        </a>
      </li>
      {getSideFilter(props.name, dict).map((item, i) => {
        return (
          <li className={item.id === props.filter ? 'active' : ''} key={i}>
            <a
              href={renderNavUrl(props.nav, props.nav.navIndex, props.name, item.id)}
              title={item.lang[props.nav.pageLang]}
            >
              <div className="entry group">
                <div className={`entry-${props.name}`}>{item.lang[props.nav.pageLang]}</div>
              </div>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SideFilter
