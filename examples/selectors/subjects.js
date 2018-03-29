import { createSelector } from 'reselect'
import pickBy from 'lodash/pickBy'
import includes from 'lodash/includes'
import { createGetter, composeGetters } from '../../src'
import { updateSubjects, fetchSubjects } from '../actions/subjects'

const isHumanitarianSubject = subject => includes(['Philosophy', 'English'], subject.name)

export const getAllSubjects = createGetter({
  stateSelector: state => state.subjects.collection,
  asyncFetcher: dispatch => dispatch(fetchSubjects()),
  onSuccess: (data, dispatch) => dispatch(updateSubjects(data)),
})

export const getHumanitarianSubjects = createSelector(
  getAllSubjects,
  allSubjectsGetter =>
    composeGetters(
      allSubjectsGetter,
      allSubjects => pickBy(allSubjects, isHumanitarianSubject)
    )
)

