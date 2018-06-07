import { compactJoin, processArguments } from '../../utils';
import compact from 'lodash/compact';
import starters from './starters';

import FIELD_TYPES, { DEFAULT_FIELDS } from '../../field-types';

const CLI_INSTALL_NAME = 'gatsby-cli';
const CLI_NAME = 'gatsby';
const CREATE_COMMAND = 'new';

const ARGUMENTS = {
  STARTER: {
    name: 'Starter',
    key: 'starter',
    onlyValue: true,
    type: FIELD_TYPES.SELECT,
    options: starters.map(starter => {
      const splitted = starter.split('/');
      return {
        label: splitted[splitted.length - 1],
        value: starter
      };
    })
  }
};

const argumentsOrder = [DEFAULT_FIELDS.NAME, DEFAULT_FIELDS.PATH, ARGUMENTS.STARTER.key];

export default {
  name: CLI_NAME,
  description: 'Generates a Gatsby project',
  initialValues: {
    [ARGUMENTS.STARTER.key]: 'https://github.com/gatsbyjs/gatsby-starter-default'
  },
  cli: CLI_NAME,
  options: [ARGUMENTS.STARTER],
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
