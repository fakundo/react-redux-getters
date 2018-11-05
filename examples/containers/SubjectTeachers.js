import React, { Component } from 'react'
import { connectGetters } from '../../src'
import { getSubjectsAndTeachers } from '../selectors/subjectTeachers'

export default
@connectGetters(state => ({
  subjectAndTeachers: getSubjectsAndTeachers(state),
}))
class SubjectTeachers extends Component {
  render() {
    console.log('Render: Composed - subjects & teachers') // eslint-disable-line
    return (<pre>{ JSON.stringify(this.props, null, ' ') }</pre>)
  }
}
