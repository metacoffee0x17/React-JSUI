import { compactJoin, processArguments } from '../../utils';
import compact from 'lodash/compact';

import FIELD_TYPES from '../../field-types';

const CLI_NAME = 'preact';
const CLI_INSTALL_NAME = 'preact-cli';
const CREATE_COMMAND = 'create';
const PRESET = 'default';

const ARGUMENTS = {
  FORCE: {
    name: 'Overwrite target directory if it exists',
    key: '--force',
    type: FIELD_TYPES.TOGGLE,
    flag: true
  },
  YARN: {
    name: 'Use yarn',
    key: '--yarn',
    type: FIELD_TYPES.TOGGLE
  }
};

export default {
  name: CLI_NAME,
  description: 'Generate a Preact project',
  cli: CLI_NAME,
  options: [ARGUMENTS.FORCE, ARGUMENTS.YARN],
  create: ({ name, ...rest }) => {
    const argz = processArguments(rest, ARGUMENTS);
    return compactJoin([CLI_NAME, CREATE_COMMAND, PRESET, name, argz]);
  },
  getForProcess: formValues => {
    const { name, path, ...rest } = formValues;
    const argz = processArguments(rest, ARGUMENTS, true);
    return {
      cli: CLI_NAME,
      cliName: CLI_INSTALL_NAME,
      name,
      path,
      argz: compact([CREATE_COMMAND, PRESET, name, ...argz])
    };
  }
};
