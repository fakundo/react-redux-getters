import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isPendingStub } from '../../src'
import { getHumanitarianSubjects } from '../selectors/subjects'

const mapStateToProps = state => ({
  humanitarianSubjects: getHumanitarianSubjects(state)
})

@connect(mapStateToProps)
export default class HumanitarianSubjects extends Component {
  static propTypes = {
    humanitarianSubjects: PropTypes.object
  };

  render() {
    const { humanitarianSubjects } = this.props
    // eslint-disable-next-line
    console.warn('Render HumanitarianSubjects: ', humanitarianSubjects)
    return isPendingStub(humanitarianSubjects) ?
      <span>Loading ...</span> :
      <pre>{ JSON.stringify(humanitarianSubjects, null, ' ') }</pre>
  }
}
