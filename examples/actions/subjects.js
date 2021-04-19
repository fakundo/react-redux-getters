export const fetchSubjects = () => (
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        1: { id: 1, name: 'Math' },
        2: { id: 2, name: 'Chemistry' },
        3: { id: 3, name: 'English' },
        4: { id: 4, name: 'Philosophy' },
      })
    }, Math.random() * 5000)
  })
)

export const UPDATE_SUBJECTS = 'UPDATE_SUBJECTS'

export const updateSubjects = (subjects) => ({
  type: UPDATE_SUBJECTS,
  subjects,
})

export const UPDATE_SUBJECTS_NEW = 'UPDATE_SUBJECTS_NEW'

export const updateSubjectsNew = (subjects) => ({
  type: UPDATE_SUBJECTS_NEW,
  subjects,
})

window.updateSubjects = updateSubjects
