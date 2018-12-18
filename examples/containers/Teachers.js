import React from 'react'
import { connectGetters } from '../../src'
import { getTeachers } from '../selectors/teachers'

let renderCount = 0

const mapGettersToProps = state => ({
  allSubjects: getTeachers(state),
})

const Teachers = (props) => {
  console.log('Render: Teachers') // eslint-disable-line
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

export default connectGetters(mapGettersToProps)(Teachers)
