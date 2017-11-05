import React from 'react'
import { Provider as StoreProvider } from 'react-redux'
import configureStore from './configureStore'
import AllSubjects from './containers/AllSubjects'
import HumanitarianSubjects from './containers/HumanitarianSubjects'

const store = configureStore()

export default () => (
  <StoreProvider store={store}>
    <div>
      <h3>All Subjects</h3>
      <AllSubjects />
      <h3>Humanitarian Subjects</h3>
      <HumanitarianSubjects />
    </div>
  </StoreProvider>
)
