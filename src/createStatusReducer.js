import { GETTER_STATUS_UPDATE } from './actions'

const initialState = {
  statuses: {},
  errors: {},
}

export default ({ dropOnAction = '' } = {}) => {
  return (state = initialState, action) => {
    switch (action.type) {
      case dropOnAction:
        return initialState

      case GETTER_STATUS_UPDATE:
        return { ...state, [action.key]: { status: action.status, error: action.error } }

      default:
        return state
    }
  }
}
