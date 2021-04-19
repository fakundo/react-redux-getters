import { createGetter } from 'react-redux-getters'
import { updateTeachers, fetchTeachers } from '../actions/teachers'

export const getTeachers = createGetter({
  stateSelector: (state) => state.teachers.collection,
  asyncFetcher: (dispatch) => dispatch(fetchTeachers()),
  stateUpdater: (data, dispatch) => dispatch(updateTeachers(data)),
})
