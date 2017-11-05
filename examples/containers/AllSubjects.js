import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isPendingStub } from '../../src'
import { getAllSubjects } from '../selectors/subjects'

const mapStateToProps = state => ({
  allSubjects: getAllSubjects(state)
})

@connect(mapStateToProps)
export default class AllSubjects extends Component {
  static propTypes = {
    allSubjects: PropTypes.object
  };

  render() {
    const { allSubjects } = this.props
    // eslint-disable-next-line
    console.warn('Render AllSubjects: ', allSubjects)
    return isPendingStub(allSubjects) ?
      <span>Loading ...</span> :
      <pre>{ JSON.stringify(allSubjects, null, ' ') }</pre>
  }
}
