import React from 'react'
import { connectGetters } from '../../src'
import { getHumanitarianSubjects } from '../selectors/subjects'

const mapGettersToProps = state => ({
  humanitarianSubjects: getHumanitarianSubjects(state)
})

const HumanitarianSubjects = (props) => {
  console.log('Render: HumanitarianSubjects') // eslint-disable-line
  return (<pre>{ JSON.stringify(props, null, ' ') }</pre>)
}

export default connectGetters(mapGettersToProps)(HumanitarianSubjects)
