import { GETTER_REPLACE } from './actions'

const initialState = {}

export default ({ dropOnAction = '' } = {}) =>
  (state = initialState, action) => {
    switch (action.type) {
      case dropOnAction:
        return initialState

      case GETTER_REPLACE: {
        const { getter } = action
        return { ...state, [getter.key]: getter }
      }

      default:
        return state
    }
  }
