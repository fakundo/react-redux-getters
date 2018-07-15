export const GETTER_REPLACE = 'GETTER_REPLACE'
export const replaceGetter = getter =>
  ({ type: GETTER_REPLACE, getter })

export const GETTER_FETCH_CALLBACK = 'GETTER_FETCH_CALLBACK'
export const getterFetchCallback = (key, callback) =>
  ({ type: GETTER_FETCH_CALLBACK, key, callback })
