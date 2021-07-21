import React from 'react'
import { connectGetters } from 'react-redux-getters'
import { getSubjectsAndTeachers } from '../selectors/subjectTeachers'

let renderCount = 0

const mapGettersToProps = (state) => ({
  subjectAndTeachers1: getSubjectsAndTeachers(state),
  subjectAndTeachers2: getSubjectsAndTeachers(state),
})

const SubjectTeachers = (props) => {
  // console.log('Render: Composed - subjects & teachers') // eslint-disable-line
  renderCount += 1
  return (
    <pre>
      {'RenderCount: '}
      {renderCount}
      {'\r\n'}
      {JSON.stringify(props, null, ' ')}
    </pre>
  )
}

export default connectGetters(mapGettersToProps)(SubjectTeachers)
