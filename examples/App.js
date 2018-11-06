import React from 'react'
import { Provider as StoreProvider } from 'react-redux'
import configureStore from './configureStore'
import AllSubjects from './containers/AllSubjects'
import HumanitarianSubjects from './containers/HumanitarianSubjects'
import Teachers from './containers/Teachers'
import SubjectTeachers from './containers/SubjectTeachers'

const store = configureStore()

export default () => (
  <StoreProvider store={store}>
    <div>
      <h5>All Subjects</h5>
      <AllSubjects foo="bar" />
      <hr />
      <h5>Humanitarian Subjects</h5>
      <HumanitarianSubjects />
      <hr />
      <h5>Teachers</h5>
      <Teachers />
      <hr />
      <h5>Composition: Subjects & Teachers</h5>
      <SubjectTeachers />
      <hr />
    </div>
  </StoreProvider>
)
