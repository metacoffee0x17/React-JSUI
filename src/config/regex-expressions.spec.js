import { crossEnvRegex, portRegex, runCommandRegex } from 'config/regex-expressions';
import {
  getArrayOfRegexMatches,
  getRegexMatches,
  getRegexResults,
  loopRegexMatches
} from 'utils/regex-utils';

const portErrorExamples = [
  'Error: listen EADDRINUSE :::4000',
  'Port 3512 is blocked',
  'Something is already running on port number 1234',
  `ERROR  Metro Bundler can't listen on port 3578`,
  'Something is already running at port 8000'
];

describe('regex-expressions', () => {
  test('port expressions', () => {
    portErrorExamples.forEach(example => {
      expect(portRegex.test(example)).toEqual(true);
    });
  });

  test('getting ports', () => {
    const ports = [4000, 3512, 1234, 3578, 8000];
    const results = portErrorExamples.map(example => {
      const result = getRegexMatches(example, portRegex);
      return parseInt(result[0][2]);
    });
    expect(results).toEqual(ports);
  });

  test('wrong message', () => {
    const result = getRegexMatches('Port is already running at 8000', portRegex);
    console.log('result is', result);
  });

  test('npm script', () => {
    const runExamples = ['npm run start', 'yarn deploy', 'yarn run build', 'yarn start', 'npm start'];
    const scripts = ['start', 'deploy', 'build', 'start', 'start'];
    const results = runExamples.map(example => {
      const result = getRegexMatches(example, runCommandRegex);
      return result[0][2] || result[0][4];
    });
    expect(results).toEqual(scripts);
  });

  test('cross env', () => {
    const command =
      'cross-env NODE_PATH=./ cross-env NODE_ENV=development cross-env DEBUG=build*,hermes*,shared:middlewares*,-hermes:resolvers cross-env DIR=hermes backpack';

    const expectation = [
      ['NODE_PATH', './'],
      ['NODE_ENV', 'development'],
      ['DEBUG', 'build*,hermes*,shared:middlewares*,-hermes:resolvers'],
      ['DIR', 'hermes']
    ];

    const results = getArrayOfRegexMatches(command, crossEnvRegex);

    results.forEach((e, index) => {
      expect([e[1], e[2]]).toEqual(expectation[index]);
    });
  });

  test('getRegexResults', () => {
    // expect(getRegexResults('npm run start', runCommandRegex)).toEqual({
    //   result: true,
    //   matches: ['npm run start', 'npm run', 'start', undefined, undefined]
    // });
  });
});
