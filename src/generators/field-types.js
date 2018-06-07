import { InputAdapter, SwitchAdapter, SelectAdapter } from 'adapters';

export const DEFAULT_FIELDS = {
  NAME: 'name',
  PATH: 'path'
};

const FIELD_TYPES = {
  TEXT: 'text',
  TOGGLE: 'toggle',
  SELECT: 'select'
};

export const typeToAdapterMap = {
  [FIELD_TYPES.TEXT]: InputAdapter,
  [FIELD_TYPES.TOGGLE]: SwitchAdapter,
  [FIELD_TYPES.SELECT]: SelectAdapter
};

export default FIELD_TYPES;
