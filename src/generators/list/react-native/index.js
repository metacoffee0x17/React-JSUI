import { compactJoin, processArguments } from '../../utils';
import compact from 'lodash/compact';

import FIELD_TYPES from '../../field-types';

const CLI_NAME = 'react-native';
const CLI_INSTALL_NAME = 'react-native-cli';
const CREATE_COMMAND = 'init';

const ARGUMENTS = {
  VERBOSE: {
    name: 'Verbose',
    key: '--verbose',
    flag: true,
    type: FIELD_TYPES.TOGGLE
  }
};

export default {
  name: CLI_NAME,
  description: 'Generates a React Native project',
  cli: CLI_NAME,
  options: [ARGUMENTS.VERBOSE],
  create: ({ name, ...rest }) => {
    const argz = processArguments(rest, ARGUMENTS);
    return compactJoin([CLI_NAME, CREATE_COMMAND, name, argz]);
  },
  getForProcess: formValues => {
    const { name, path, ...rest } = formValues;
    const argz = processArguments(rest, ARGUMENTS, true);
    return {
      cli: CLI_NAME,
      cliName: CLI_INSTALL_NAME,
      name,
      path,
      argz: compact([CREATE_COMMAND, name, ...argz])
    };
  }
};
