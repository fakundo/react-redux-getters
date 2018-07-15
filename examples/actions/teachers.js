export const fetchTeachers = () => () =>
  (new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        1: { id: 1, name: 'John Snow' },
        2: { id: 2, name: 'Aria Stark' },
        3: { id: 3, name: 'Jaime Lannister' },
      })
    }, (Math.random() * 5000) + 5000)
  }))

export const UPDATE_TEACHERS = 'UPDATE_TEACHERS'

export const updateTeachers = teachers => ({
  type: UPDATE_TEACHERS,
  teachers
})
