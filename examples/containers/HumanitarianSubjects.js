import React, { Component } from 'react'
import { connectGetters } from '../../src'
import { getHumanitarianSubjects } from '../selectors/subjects'

const mapGettersToProps = state => ({
  humanitarianSubjects: getHumanitarianSubjects(state)
})

class HumanitarianSubjects extends Component {
  render() {
    console.log('Render: HumanitarianSubjects') // eslint-disable-line
    return (<pre>{ JSON.stringify(this.props, null, ' ') }</pre>)
  }
}

export default connectGetters(mapGettersToProps)(HumanitarianSubjects)
