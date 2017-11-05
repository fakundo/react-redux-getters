import { UPDATE_SUBJECTS } from '../actions/subjects'

const initialState = { collection: undefined }

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SUBJECTS:
      return { collection: action.subjects }

    default:
      return state
  }
}
