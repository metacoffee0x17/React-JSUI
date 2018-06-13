import { portRegex } from 'config/regex-expressions';
import { getRegexMatches } from 'utils/regex-utils';

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
  })
});
