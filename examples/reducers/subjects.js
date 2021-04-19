import { UPDATE_SUBJECTS } from '../actions/subjects'

const initialState = { collection: undefined }

export const subjects = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SUBJECTS:
      return { collection: action.subjects }

    default:
      return state
  }
}
