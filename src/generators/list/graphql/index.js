import { compactJoin, processArguments } from '../../utils';
import compact from 'lodash/compact';
import starters from './starters';

import FIELD_TYPES, { DEFAULT_FIELDS } from '../../field-types';

const CLI_INSTALL_NAME = 'graphql-cli';
const CLI_NAME = 'graphql';
const CREATE_COMMAND = 'create';

const ARGUMENTS = {
  BOILERPLATE: {
    name: 'Boilerplate',
    key: '--boilerplate',
    type: FIELD_TYPES.SELECT,
    options: starters.map(({ value, label }) => {
      return {
        label: `${value} - ${label}`,
        value: value
      };
    })
  },
  CUSTOM_BOILERPLATE: {
    name: 'Custom boilerplate',
    key: 'custom-boilerplate'
  }
};

const argumentsOrder = [
  DEFAULT_FIELDS.NAME,
  DEFAULT_FIELDS.PATH,
  ARGUMENTS.BOILERPLATE.key
];

export default {
  name: CLI_NAME,
  description: 'Generates a GraphQL server',
  initialValues: {
    [ARGUMENTS.BOILERPLATE.key]: 'node-minimal'
  },
  cli: CLI_NAME,
  options: [ARGUMENTS.BOILERPLATE],
  create: ({ name, ...rest }) => {
    const argz = processArguments(rest, ARGUMENTS);
    return compactJoin([CLI_NAME, CREATE_COMMAND, name, argz]);
  },
  getForProcess: formValues => {
    const { name, path, ...rest } = formValues;
    const argz = processArguments(rest, ARGUMENTS, true, argumentsOrder);

    return {
      cli: CLI_NAME,
      name,
      cliName: CLI_INSTALL_NAME,
      path,
      argz: compact([CREATE_COMMAND, name, ...argz])
    };
  }
};
