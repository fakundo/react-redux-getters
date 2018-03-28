import { PENDING, SUCCEDED, FAILED } from './statuses'

export const GETTER_STATUS_UPDATE = 'GETTER_STATUS_UPDATE'

export const setStatusPending = key => ({
  type: GETTER_STATUS_UPDATE,
  status: PENDING,
  key,
})

export const setStatusSucceded = (key, callback) => ({
  type: GETTER_STATUS_UPDATE,
  status: SUCCEDED,
  key,
  callback,
})

export const setStatusFailed = (key, error, callback) => ({
  type: GETTER_STATUS_UPDATE,
  status: FAILED,
  key,
  error,
  callback,
})
