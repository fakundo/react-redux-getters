# react-redux-getters

[![npm](https://img.shields.io/npm/v/react-redux-getters.svg)](https://www.npmjs.com/package/react-redux-getters)

Provides an extra layer of 'getters' between your React components and the Redux store.
The getter returns the data from the store, if it's there, otherwise it returns a stub and invokes the fetch action.
So the store is filled automatically.

### Installation
```
yarn add react-redux-getters
```

### Usage

#### Create getter

```js
import { createGetter } from 'react-redux-getters'
import { updateSubjects, fetchSubjects } from 'actions/subjects'

export const getSubjects = createGetter({
  stateSelector: (state) => state.subjects,
  asyncFetcher: () => fetchSubjects(),
  stateUpdater: (data, dispatch) => dispatch(updateSubjects(data)),
})
```

#### Configure store

``` js
import { createStore, applyMiddleware } from 'redux'
import { gettersMiddleware } from 'react-redux-getters'

const store = createStore(
  reducers,
  applyMiddleware(gettersMiddleware, ...),
)
```

#### Component

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connectGetters } from 'react-redux-getters'
import { getSubjects } from 'selectors/subjects'

class Subjects extends Component {
  static propTypes = {
    subjectsGetter: PropTypes.object.isRequired
  }

  render() {
    const { subjectsGetter } = this.props
    const { isSucceded, isPending, isFailure, error, data } = subjectsGetter
    
    if (isPending) {
      return (
        <LoadingRenderer />
      )
    }

    if (isFailure) {
      return (
        <ErrorRenderer error={error} />
      )
    }

    return (
      <DataRenderer data={data} />
    )
  }
}

const mapGettersToProps = (state) => ({
  subjectsGetter: getSubjects(state),
})

export default connectGetters(mapGettersToProps)(Subjects)
```

#### Done! 

Your React component will be rerendered when the getter fetches the data and stores it in the Redux store.

### Usage with [reselect](https://github.com/reduxjs/reselect)

#### Create selector with getter

```js
import { createSelector } from 'reselect'
import { createGetter, composeGetters } from 'react-redux-getters'
import { getSubjects } from 'selectors/subjects'
import { getTeachers } from 'selectors/teachers'

export const getHumanitarianSubjects = createSelector(
  getSubjects,
  (subjectsGetter) => composeGetters(
    subjectsGetter,
    (subjects) => filterHumanitarianSubjects(subjects)
  )
)
```

#### Component (usage is the same as with a regular getter)

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connectGetters } from 'react-redux-getters'
import { getHumanitarianSubjects } from 'selectors/subjects'

class HumanitarianSubjects extends Component {
  static propTypes = {
    humanitarianSubjectsGetter: PropTypes.object.isRequired
  }

  render() {
    const { humanitarianSubjectsGetter } = this.props
    const { isSucceded, isPending, isFailure, error, data } = humanitarianSubjectsGetter
    ...
  }
}

const mapGettersToProps = (state) => ({
  humanitarianSubjectsGetter: getHumanitarianSubjects(state),
})

export default connectGetters(mapGettersToProps)(HumanitarianSubjects)
```

### More examples

#### Composing getters

```js
import { createSelector } from 'reselect'
import { createGetter, composeGetters } from 'react-redux-getters'
import { getSubjects } from 'selectors/subjects'
import { getTeachers } from 'selectors/teachers'

export const getSubjectsAndTeachers = createSelector(
  getSubjects,
  getTeachers,
  (subjectsGetter, teachersGetter) => composeGetters(
    subjectsGetter,
    teachersGetter,
    (subjects, teachers) => ({ subjects, teachers })
  )
)
```

#### Using props

```js
// Getter
import { createGetter } from 'react-redux-getters'
import { fetchTeacher, updateTeacher } from 'actions/teachers'

export const getTeacher = createGetter({
  stateSelector: (state, props) => state.teachers[props.teacherId],
  asyncFetcher: (dispatch, state, props) => fetchTeacher(props.teacherId),
  stateUpdater: (data, dispatch, state, props) => dispatch(updateTeacher(props.teacherId, data))
})

// Component
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connectGetters } from 'react-redux-getters'
import { getTeacher } from 'selectors/teachers'

class Teacher extends Component {
  ...
}

const mapGettersToProps = (state, props) => ({
  teacherGetter: getTeacher(state, { teacherId: props.teacherId }),
})

export default connectGetters(mapGettersToProps)(Teacher)

// Using component
<Teacher teacherId={1} />
```

#### Composing getters without reselect

```js
import { composeGetters } from 'react-redux-getters'
import { getSubjects } from 'actions/subjects'

export const getSubject = (state, props) => composeGetters(
  getSubjects(state),
  (subjects) => findSubjectById(subjects, props.subjectId)
)
```

### API

```js
import { createGetter, composeGetters } from 'react-redux-getters'

createGetter({
  stateSelector: (state, props) => dataFromState, // Required func – should return data from store state
  asyncFetcher: async (dispatch, state, props) => fetchedData, // Required async func – should return fetched data (Promise)
  stateUpdater: (data, dispatch, state, props) => {}, // Required func - should dispatch store update
  shouldFetch: (dataFromState, state, props) => isNil(dataFromState) // Optional func – condition that fetching is needed
})

composeGetters(
  ...getters, 
  composeData: (...gettersData) => newComposedData // Func – creates composed data from incoming getters data
)
```

### License

MIT
