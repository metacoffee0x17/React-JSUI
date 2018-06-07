import { compactJoin, processArguments } from '../../utils';
import compact  from 'lodash/compact';

const CLI_NAME = 'ng';
const CLI_INSTALL_NAME = ' @angular/cli';
const CREATE_COMMAND = 'new';

const ARGUMENTS = {};

export default {
  name: CLI_NAME,
  description: 'Generates an Angular project',
  cli: CLI_NAME,
  title: CLI_INSTALL_NAME,
  options: [],
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
