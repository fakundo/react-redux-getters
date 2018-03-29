import isNil from 'lodash/isNil'

let GETTER_INDEX = 0

export default ({
  stateSelector,
  asyncFetcher,
  shouldFetch = isNil,
  onSuccess = () => {},
  onFailure = () => {},
  serializeProps = props => JSON.stringify(props),
}) => {
  const index = (GETTER_INDEX += 1, GETTER_INDEX)
  return (state, props = {}, ...additionalParams) => {
    const key = `${index}${serializeProps(props)}`
    const data = stateSelector(state, props, ...additionalParams)
    const statusState = state.getters[key]
    const status = statusState && statusState.status
    const error = statusState && statusState.error

    return {
      key,
      data,
      props,
      additionalParams,
      error,
      status,
      shouldFetch,
      asyncFetcher,
      onSuccess,
      onFailure,
    }
  }
}
