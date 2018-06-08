import { compactJoin, processArguments } from '../../utils';
import compact from 'lodash/compact';

import FIELD_TYPES from '../../field-types';

const CLI_NAME = 'create-react-native-app';

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
  description: 'Generate a React Native project using Expo',
  cli: CLI_NAME,
  options: [ARGUMENTS.VERBOSE],
  create: ({ name, ...rest }) => {
    const argz = processArguments(rest, ARGUMENTS);
    return compactJoin([CLI_NAME, name, argz]);
  },
  getForProcess: formValues => {
    const { name, path, ...rest } = formValues;
    const argz = processArguments(rest, ARGUMENTS, true);
    return {
      cli: CLI_NAME,
      name,
      path,
      argz: compact([name, ...argz])
    };
  }
};
