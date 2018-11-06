import React from 'react'
import { connectGetters } from '../../src'
import { getAllSubjects } from '../selectors/subjects'

const mapGettersToProps = state => ({
  allSubjects: getAllSubjects(state),
})

const AllSubjects = (props) => {
  console.log('Render: AllSubjects') // eslint-disable-line
  return (<pre>{ JSON.stringify(props, null, ' ') }</pre>)
}

export default connectGetters(mapGettersToProps)(AllSubjects)
