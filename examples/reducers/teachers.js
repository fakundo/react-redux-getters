import { UPDATE_TEACHERS } from '../actions/teachers'

const initialState = { collection: undefined }

export const teachers = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TEACHERS:
      return { collection: action.teachers }

    default:
      return state
  }
}
