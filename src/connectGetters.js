import { connectAdvanced } from 'react-redux'
import find from 'lodash/find'
import isFunction from 'lodash/isFunction'
import some from 'lodash/some'
import mapValues from 'lodash/mapValues'
import isShallowEqual from 'shallowequal'
import { FAILED } from './statuses'
import { replaceGetter, getterFetchCallback } from './actions'
import { GetterComposition } from './composeGetters'
import createGetterState from './createGetterState'

const isResultEqual = (result, nextResult = {}) => {
  return !some(result, (value, key) => !isShallowEqual(value, nextResult[key]))
}

const processGetter = (state, dispatch, getter) => {
  const { key, props, shouldFetch, asyncFetcher, stateUpdater } = getter

  // Fetching
  if (shouldFetch) {
    delete getter.shouldFetch // eslint-disable-line

    asyncFetcher(dispatch, state, props)
      .then(fetchResult => dispatch(getterFetchCallback(
        key,
        actualState => stateUpdater(fetchResult, dispatch, actualState, props)
      )))
      .catch(error => dispatch(getterFetchCallback(
        key,
        (actualState, actualGetter) => dispatch(replaceGetter(createGetterState({
          ...actualGetter,
          status: FAILED,
          error
        })))
      )))
  }

  // Return result object
  return getter.result
}

const processGetterComposition = (state, dispatch, composition) => {
  const { getters, composeData } = composition
  const processGetterOrComposition = makeProcessGetterOrComposition(state, dispatch) // eslint-disable-line

  // Process each getter in composition
  const results = getters.map(processGetterOrComposition)

  // Check if some of getters are pending
  const pendingResult = find(results, 'isPending')
  if (pendingResult) return pendingResult

  // Check if some of getters are failed
  const failedResult = find(results, 'isFailed')
  if (failedResult) return failedResult

  // Find new result data
  const composedData = composeData(...results.map(result => result.data))

  // Return new data with statuses taken from first getter in composition
  // Because every getter is succeded here
  return { ...results[0], data: composedData }
}

const makeProcessGetterOrComposition = (state, dispatch) => (getter) => {
  const processFunc = getter instanceof GetterComposition ?
    processGetterComposition :
    processGetter
  return processFunc(state, dispatch, getter)
}

const createSelectorFactory = (dispatch, { mapGettersToProps }) => {
  let realMapGettersToProps
  let ownProps
  let allProps
  let getters
  let result

  return (nextState, nextOwnProps) => {
    let nextGetters

    // Find real mapGettersToProps and save it in upper scope
    // Useful when you want to create component with own reselect selector
    if (realMapGettersToProps) {
      nextGetters = realMapGettersToProps(nextState, nextOwnProps)
    } else {
      nextGetters = mapGettersToProps(nextState, nextOwnProps)
      if (isFunction(nextGetters)) {
        realMapGettersToProps = nextGetters
        nextGetters = realMapGettersToProps(nextState, nextOwnProps)
      } else {
        realMapGettersToProps = mapGettersToProps
      }
    }

    const gettersChanged = !isShallowEqual(getters, nextGetters)
    const ownPropsChanged = !isShallowEqual(ownProps, nextOwnProps)
    let resultChanged = false

    // Getters changed, recalculate result
    if (gettersChanged) {
      getters = nextGetters
      const processGetterOrComposition = makeProcessGetterOrComposition(nextState, dispatch)
      const nextResult = mapValues(nextGetters, processGetterOrComposition)
      resultChanged = !isResultEqual(nextResult, result)
      if (resultChanged) result = nextResult
    }

    // Own props changed, memoize new own props
    if (ownPropsChanged) {
      ownProps = nextOwnProps
    }

    // Result or own props changed, memoize all props
    if (resultChanged || ownPropsChanged) {
      allProps = { ...ownProps, ...result }
    }

    return allProps
  }
}

export default (mapGettersToProps, options) => {
  return connectAdvanced(createSelectorFactory, { ...options, mapGettersToProps })
}
