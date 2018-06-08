import { compactJoin, getDefaultOrder, processArguments } from '../../utils';
import compact from 'lodash/compact';
import map from 'lodash/map';

import FIELD_TYPES from '../../field-types';

const CLI_INSTALL_NAME = 'express-generator';
const CLI_NAME = 'express';

const ARGUMENTS = {
  VIEW: {
    name: 'Template engine',
    key: '--view',
    type: FIELD_TYPES.SELECT,
    options: `jade|dust|ejs|hbs|hjs|pug|twig|vash|hogan`.split('|').map(o => ({
      value: o,
      label: o
    }))
  },
  CSS: {
    name: 'CSS engine',
    key: '--css',
    type: FIELD_TYPES.SELECT,
    options: `css|less|stylus|compass|sass`.split('|').map(o => ({
      value: o,
      label: o
    }))
  },
  ADD_GITIGNORE: {
    name: 'Add .gitignore',
    type: FIELD_TYPES.TOGGLE,
    key: '--git',
    flag: true
  },
  FORCE: {
    name: 'Force on non-empty directory',
    type: FIELD_TYPES.TOGGLE,
    key: '--force',
    flag: true
  }
};

const argumentsOrder = getDefaultOrder(ARGUMENTS);

export default {
  name: CLI_NAME,
  description: 'Generates an Express server',
  initialValues: {
    [ARGUMENTS.CSS.key]: 'css',
    [ARGUMENTS.VIEW.key]: 'jade'
  },
  cli: CLI_NAME,
  options: map(ARGUMENTS),
  create: ({ name, ...rest }) => {
    const argz = processArguments(rest, ARGUMENTS);
    return compactJoin([CLI_NAME, name, argz]);
  },
  getForProcess: formValues => {
    const { name, path, ...rest } = formValues;
    const argz = processArguments(rest, ARGUMENTS, true, argumentsOrder);
    return {
      cli: CLI_NAME,
      name,
      cliName: CLI_INSTALL_NAME,
      path,
      argz: compact([name, ...argz])
    };
  }
};
