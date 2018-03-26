import React from 'react'
import { Provider as StoreProvider } from 'react-redux'
import configureStore from './configureStore'
import AllSubjects from './containers/AllSubjects'
import HumanitarianSubjects from './containers/HumanitarianSubjects'
import Composed from './containers/Composed'

const store = configureStore()

export default () => (
  <StoreProvider store={store}>
    <div>
      <h5>All Subjects</h5>
      <AllSubjects />
      <hr />
      <h5>Humanitarian Subjects</h5>
      <HumanitarianSubjects />
      <hr />
      <h5>Getters Composition</h5>
      <Composed />
      <hr />
    </div>
  </StoreProvider>
)
