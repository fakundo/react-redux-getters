import React from 'react'
import { connectGetters } from 'react-redux-getters'
import { getHumanitarianSubjects } from '../selectors/subjects'

let renderCount = 0

const mapGettersToProps = (state) => ({
  humanitarianSubjects: getHumanitarianSubjects(state),
})

const HumanitarianSubjects = (props) => {
  // console.log('Render: HumanitarianSubjects') // eslint-disable-line
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

export default connectGetters(mapGettersToProps)(HumanitarianSubjects)
