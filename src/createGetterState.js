import { PENDING, SUCCEDED, FAILED } from './statuses'

export default ({ status, stateData, error, ...rest }) => ({
  ...rest,
  status,
  stateData,
  error,
  result: {
    isPending: status === PENDING,
    isSucceded: status === SUCCEDED,
    isFailed: status === FAILED,
    data: status === SUCCEDED ? stateData : undefined,
    error: status === FAILED ? error : undefined,
  }
})
