import isObject from 'lodash/isObject'

export const GETTER_FIELD_NAME = '_getter'

export const isGetter = (getter) => (
  isObject(getter) && GETTER_FIELD_NAME in getter
)
