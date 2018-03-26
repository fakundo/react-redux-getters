export const GETTER_STATUS_UPDATE = 'GETTER_STATUS_UPDATE'
export const updateGetterStatus = (key, status, error) =>
  ({ type: GETTER_STATUS_UPDATE, key, status, error })
