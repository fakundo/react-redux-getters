import React from 'react'
import { connectGetters } from '../../src'
import { getAllSubjects } from '../selectors/subjects'

let renderCount = 0

const mapGettersToProps = state => ({
  allSubjects: getAllSubjects(state),
})

const AllSubjects = (props) => {
  console.log('Render: AllSubjects') // eslint-disable-line
  renderCount += 1
  return (
    <pre>
      { 'RenderCount: ' }
      { renderCount }
      { '\r\n' }
      { JSON.stringify(props, null, ' ') }
    </pre>
  )
}

export default connectGetters(mapGettersToProps)(AllSubjects)
