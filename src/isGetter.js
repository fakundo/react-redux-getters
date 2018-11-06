import isObject from 'lodash/isObject'

export default getter => (
  isObject(getter) && '_getter' in getter
)
