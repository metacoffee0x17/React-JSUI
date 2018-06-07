import { compactJoin, processArguments } from './utils';

describe('generator utils', () => {
  test('compact join', () => {
    expect(compactJoin(['--scripts-version', 'custom-react-scripts'])).toEqual(
      '--scripts-version custom-react-scripts'
    );
  });

  test('argument falsy', () => {
    [null, undefined, ''].forEach(v => {
      expect(compactJoin(['--verbose', v])).toEqual('--verbose');
    });
  });

  test('processArguments', () => {
    const ARGUMENTS = {
      SCRIPTS_VERSION: {
        key: '--scripts-version'
      },
      USE_NPM: {
        key: '--use-npm',
        flag: true
      },
      VERBOSE: {
        key: '--verbose',
        flag: true
      },
      INFO: {
        key: '--info',
        flag: true
      }
    };

    const list = {
      '--scripts-version': 'custom-react-scripts',
      '--verbose': true,
      '--use-npm': true,
      '--info': false
    };

    const result = `--scripts-version custom-react-scripts --use-npm --verbose`;

    expect(processArguments(list, ARGUMENTS)).toEqual(result);
  });

  test('process arguments as array', () => {
    const ARGUMENTS = {
      SCRIPTS_VERSION: {
        key: '--scripts-version'
      },
      USE_NPM: {
        key: '--use-npm',
        flag: true
      },
      VERBOSE: {
        key: '--verbose',
        flag: true
      },
      INFO: {
        key: '--info',
        flag: true
      }
    };

    const list = {
      '--scripts-version': 'custom-react-scripts',
      '--verbose': true,
      '--use-npm': true,
      '--info': false
    };

    let result = ['--scripts-version custom-react-scripts', '--use-npm', '--verbose'];

    expect(processArguments(list, ARGUMENTS, true)).toEqual(result);
  });

  test('process arguments as array with order', () => {
    const ARGUMENTS = {
      SCRIPTS_VERSION: {
        key: '--scripts-version'
      },
      USE_NPM: {
        key: '--use-npm',
        flag: true
      },
      VERBOSE: {
        key: '--verbose',
        flag: true
      },
      INFO: {
        key: '--info',
        flag: true
      }
    };

    const order = ['--verbose', '--info', '--use-npm', '--scripts-version'];

    const list = {
      '--scripts-version': 'custom-react-scripts',
      '--verbose': true,
      '--use-npm': true,
      '--info': false
    };

    let result = ['--verbose', '--use-npm', '--scripts-version custom-react-scripts'];

    expect(processArguments(list, ARGUMENTS, true, order)).toEqual(result);
  });

  test('process arguments as array with order and silent arguments', () => {
    const ARGUMENTS = {
      STARTER: {
        key: 'starter',
        onlyValue: true
      },
      SCRIPTS_VERSION: {
        key: '--scripts-version'
      },
      USE_NPM: {
        key: '--use-npm',
        flag: true
      },
      VERBOSE: {
        key: '--verbose',
        flag: true
      },
      INFO: {
        key: '--info',
        flag: true
      }
    };

    const order = ['starter', '--verbose', '--info', '--use-npm', '--scripts-version'];

    const list = {
      starter: 'gatsby-cool-starter',
      '--scripts-version': 'custom-react-scripts',
      '--verbose': true,
      '--info': false
    };

    let result = ['gatsby-cool-starter', '--verbose', '--scripts-version custom-react-scripts'];

    expect(processArguments(list, ARGUMENTS, true, order)).toEqual(result);
  });
});
