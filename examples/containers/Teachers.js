import React from 'react'
import { connectGetters } from '../../src'
import { getTeachers } from '../selectors/teachers'

const mapGettersToProps = state => ({
  allSubjects: getTeachers(state),
})

const Teachers = (props) => {
  console.log('Render: Teachers') // eslint-disable-line
  return (<pre>{ JSON.stringify(props, null, ' ') }</pre>)
}

export default connectGetters(mapGettersToProps)(Teachers)
