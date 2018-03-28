// function createThunkMiddleware(extraArgument) {
//   return ({ dispatch, getState }) => next => action => {
//     if (typeof action === 'function') {
//       return action(dispatch, getState, extraArgument);
//     }

//     return next(action);
//   };
// }

// const thunk = createThunkMiddleware();
// thunk.withExtraArgument = createThunkMiddleware;
import includes from 'lodash/includes'
import { GETTER_STATUS_UPDATE } from './actions'
import { PENDING, SUCCEDED, FAILED } from './statuses'

export default ({ getState }) => next => (action) => {
  const { type, status, callback } = action
  if (type === GETTER_STATUS_UPDATE && includes([SUCCEDED, FAILED], status)) {
    const state = getState()
    const statusState = state.getters[action.key]
    const currentStatus = statusState && statusState.status
    if (currentStatus !== PENDING) {
      return action
    }
    callback(state)
  }
  return next(action)
}
