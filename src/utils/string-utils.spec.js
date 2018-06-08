import { getHttpsGitURL } from './string-utils';

describe('string utils', () => {
  test('getHttpsGitURL', () => {
    const url1 = 'https://github.com/kitze/JSUI.git';
    const url2 = 'git@github.com:getinsomnia/insomnia';

    expect(getHttpsGitURL(url1)).toEqual('https://github.com/kitze/JSUI');
    expect(getHttpsGitURL(url2)).toEqual('https://github.com/getinsomnia/insomnia');
  });
});
