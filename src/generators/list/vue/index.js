import { compactJoin, processArguments } from '../../utils';
import compact from 'lodash/compact';

import FIELD_TYPES from '../../field-types';

const CLI_NAME = 'vue';
const CLI_INSTALL_NAME = '@vue/cli';
const CREATE_COMMAND = 'create';

const ARGUMENTS = {
  FORCE: {
    name: 'Overwrite target directory if it exists',
    key: '--force',
    flag: true,
    type: FIELD_TYPES.TOGGLE
  },
  CLONE: {
    name: 'Use git clone when fetching remote preset',
    key: '--clone',
    flag: true,
    type: FIELD_TYPES.TOGGLE
  },
  PACKAGE_MANAGER: {
    name: 'Package Manager',
    key: '--packageManager',
    type: FIELD_TYPES.SELECT,
    options: [
      {
        label: 'npm',
        value: 'npm'
      },
      {
        label: 'yarn',
        value: 'yarn'
      }
    ]
  }
};

const DEFAULT_OPTION = '--default';

export default {
  name: CLI_NAME,
  description: 'Generate a Vue project',
  cli: CLI_NAME,
  initialValues: {
    [ARGUMENTS.PACKAGE_MANAGER.key]: 'yarn'
  },
  options: [ARGUMENTS.FORCE, ARGUMENTS.CLONE, ARGUMENTS.PACKAGE_MANAGER],
  create: ({ name, ...rest }) => {
    const argz = processArguments(rest, ARGUMENTS);
    return compactJoin([CLI_NAME, CREATE_COMMAND, name, DEFAULT_OPTION, argz]);
  },
  getForProcess: formValues => {
    const { name, path, ...rest } = formValues;
    const argz = processArguments(rest, ARGUMENTS, true);
    let argsForProcess = {
      cli: CLI_NAME,
      cliName: CLI_INSTALL_NAME,
      name,
      path,
      argz: compact([CREATE_COMMAND, name, DEFAULT_OPTION, ...argz])
    };
    console.log('argsForProcess', argsForProcess);
    return argsForProcess;
  }
};
