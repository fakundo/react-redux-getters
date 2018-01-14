import isEqual from 'lodash/isEqual'

export const PENDING_STUB = { __pending: true }
export const FAILURE_STUB = { __failed: true }

export const isPendingStub = data => isEqual(data, PENDING_STUB)
export const isFailureStub = data => isEqual(data, FAILURE_STUB)
export const isSuccededData = data => !isPendingStub(data) && !isFailureStub(data)
