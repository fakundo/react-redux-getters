import { createGetter } from '../../src'
import { updateTeachers, fetchTeachers } from '../actions/teachers'

export const getTeachers = createGetter({
  stateSelector: state => state.teachers.collection,
  asyncFetcher: dispatch => dispatch(fetchTeachers()),
  onSuccess: (data, dispatch) => dispatch(updateTeachers(data)),
})
