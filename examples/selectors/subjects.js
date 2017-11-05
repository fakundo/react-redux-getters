import pickBy from 'lodash/pickBy'
import includes from 'lodash/includes'
import { createSelector } from 'reselect'
import { isSuccededData } from '../../src'

const isHumanitarianSubject = subject => includes(['Philosophy', 'English'], subject.name)

export const getAllSubjects = state => state.getters.allSubjects()

export const getHumanitarianSubjects = createSelector(
  getAllSubjects,
  (allSubjects) => {
    if (isSuccededData(allSubjects)) {
      return pickBy(allSubjects, isHumanitarianSubject)
    }
    return allSubjects
  }
)
