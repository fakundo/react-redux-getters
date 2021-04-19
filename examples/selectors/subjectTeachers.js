import { createSelector } from 'reselect'
import { composeGetters } from 'react-redux-getters'
import { getTeachers } from './teachers'
import { getAllSubjects } from './subjects'

export const getSubjectsAndTeachers = createSelector(
  getAllSubjects,
  getTeachers,
  (subjects, teachers) => composeGetters(
    subjects,
    teachers,
    (subjectsData, teachersData) => ({
      subjects: subjectsData,
      teachers: teachersData,
    }),
  ),
)
