### Fetch data and fill store automatically

[![npm](https://img.shields.io/npm/v/redux-getters.svg?maxAge=2592000)](https://www.npmjs.com/package/redux-getters)

This library provides an additional layer of getters between the store and components. The getter returns data from the store if they are there, otherwise it returns stub and invokes fetch action.

Getters themselves are stored in the state of the store for easy access to them. For example, for using within selectors.

### Installation
```
yarn add redux-getters
```

### Usage

#### Creating a getter

```javascript
import { updateSubjects, fetchSubjects } from '../actions/subjects'
import { createGetter } from 'redux-getters'

export const allSubjects = () => createGetter({
  stateSelector: state => state.subjects.collection,
  asyncFetcher: dispatch => dispatch(fetchSubjects()),
  getUpdatingAction: data => updateSubjects(data)
})
```

#### Configure store

``` javascript
import { createReducer as createGettersReducer } from 'redux-getters'
import * as getters from './getters'

const store = createStore(
  combineReducers({
    getters: createGettersReducer(() => store, getters)
  })
)
```

#### Using within selector

```javascript
export const getAllSubjects = state => state.getters.allSubjects()
```

#### Component

```javascript
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isPendingStub } from 'redux-getters'
import { getAllSubjects } from '../selectors/subjects'

const mapStateToProps = state => ({
  allSubjects: getAllSubjects(state)
})

@connect(mapStateToProps)
export default class AllSubjects extends Component {
  static propTypes = {
    allSubjects: PropTypes.object
  }

  render() {
    const { allSubjects } = this.props
    return isPendingStub(allSubjects) ?
      <span>Loading ...</span> :
      <pre>{ JSON.stringify(allSubjects, null, ' ') }</pre>
  }
}
```

### API

```javascript
createGetter({
  stateSelector,
  asyncFetcher,
  getPendingAction,
  getSuccessAction,
  getFailureAction,
  getUpdatingAction
} = {})

createGettersReducer(getStore, getters)

isPendingStub(data)

isFailureStub(data)

isSuccededData(data)
```
