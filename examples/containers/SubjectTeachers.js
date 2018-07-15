import React, { Component } from 'react'
import { connectGetters } from '../../src'
import { getSubjectsAndTeachers } from '../selectors/subjectTeachers'

@connectGetters(state => ({
  subjectAndTeachers: getSubjectsAndTeachers(state),
}))
export default class SubjectTeachers extends Component {
  render() {
    console.log('Render: Composed - subjects & teachers') // eslint-disable-line
    return (<pre>{ JSON.stringify(this.props, null, ' ') }</pre>)
  }
}
