import React, { Component } from 'react'
import { connectGetters } from '../../src'
import { getAllSubjects } from '../selectors/subjects'

export default
@connectGetters(state => ({
  allSubjects: getAllSubjects(state),
}))
class AllSubjects extends Component {
  render() {
    console.log('Render: AllSubjects') // eslint-disable-line
    return (<pre>{ JSON.stringify(this.props, null, ' ') }</pre>)
  }
}
