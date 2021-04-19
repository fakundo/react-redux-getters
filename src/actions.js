export const GETTER_FETCH_CALLBACK = '@react-redux-getters/GETTER_FETCH_CALLBACK'

export const getterFetchCallback = (callback) => (
  { type: GETTER_FETCH_CALLBACK, callback }
)
