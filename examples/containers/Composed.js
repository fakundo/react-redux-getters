import React, { Component } from 'react'
import { connectGetters } from '../../src'
import { getSubjectsAndTeachers } from '../selectors/composed'

@connectGetters(state => ({
  subjectAndTeachers: getSubjectsAndTeachers(state),
}))
export default class Composed extends Component {
  render() {
    return (<pre>{ JSON.stringify(this.props, null, ' ') }</pre>)
  }
}
