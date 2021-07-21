import isObject from 'lodash/isObject'

export const GETTER_FIELD = '__getter'

export const isGetter = (getter) => (
  isObject(getter) && GETTER_FIELD in getter
)
