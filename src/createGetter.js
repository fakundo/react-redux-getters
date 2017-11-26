import { PENDING_STUB, FAILURE_STUB } from './stubs'

export default options => (dispatch, getState, ...args) => {
  const {
    stateSelector,
    asyncFetcher,
    getPendingAction,
    getSuccessAction,
    getFailureAction,
    getUpdatingAction,
    shouldFetch = stateData => stateData === undefined
  } = options

  const stateData = stateSelector(getState())

  if (shouldFetch(stateData)) {
    dispatch((getPendingAction || getUpdatingAction)(PENDING_STUB))

    setImmediate(async () => {
      try {
        const fetchedData = await asyncFetcher(dispatch, getState, ...args)
        dispatch((getSuccessAction || getUpdatingAction)(fetchedData))
      } catch (error) {
        dispatch((getFailureAction || getUpdatingAction)(FAILURE_STUB))
      }
    })

    return stateSelector(getState())
  }

  return stateData
}
