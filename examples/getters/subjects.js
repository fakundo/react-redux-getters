import { updateSubjects, fetchSubjects } from '../actions/subjects'
import { createGetter } from '../../src'

export const allSubjects = () => createGetter({
  stateSelector: state => state.subjects.collection,
  asyncFetcher: dispatch => dispatch(fetchSubjects()),
  getUpdatingAction: data => updateSubjects(data)
})
