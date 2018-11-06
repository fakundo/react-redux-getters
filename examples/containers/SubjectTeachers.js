import React from 'react'
import { connectGetters } from '../../src'
import { getSubjectsAndTeachers } from '../selectors/subjectTeachers'

const mapGettersToProps = state => ({
  subjectAndTeachers: getSubjectsAndTeachers(state),
})

const SubjectTeachers = (props) => {
  console.log('Render: Composed - subjects & teachers') // eslint-disable-line
  return (<pre>{ JSON.stringify(props, null, ' ') }</pre>)
}

export default connectGetters(mapGettersToProps)(SubjectTeachers)
