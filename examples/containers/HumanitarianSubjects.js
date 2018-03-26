import React, { Component } from 'react'
import { connectGetters } from '../../src'
import { getHumanitarianSubjects } from '../selectors/subjects'

@connectGetters(state => ({
  humanitarianSubjects: getHumanitarianSubjects(state)
}))
export default class HumanitarianSubjects extends Component {
  render() {
    return (<pre>{ JSON.stringify(this.props, null, ' ') }</pre>)
  }
}
