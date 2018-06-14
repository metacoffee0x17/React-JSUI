import {isSpecificFolder, getBranchFromUrl, isValidRepoUrl, getSvnUrl} from './github-utils';

describe('github-utils', () => {
  test('get branch from url', () => {
    expect(getBranchFromUrl('https://github.com/zeit/next.js/tree/canary/examples/')).toEqual('canary');
  });

  test('get svn url', () => {
    expect(getSvnUrl('https://github.com/zeit/next.js/tree/canary/examples/custom-server-koa')).toEqual('https://github.com/zeit/next.js/trunk/examples/custom-server-koa')
  })

  test('is valid repo url', () => {
    const validUrls = [
      'https://github.com/zeit/next.js/tree/master/examples/whatever',
      'https://github.com/zeit/next.js',
      'https://github.com/zeit/next.js/tree/canary/examples/'
    ];
    validUrls.forEach(url => expect(isValidRepoUrl(url)).toEqual(true));
  });

  test('is invalid repo url', () => {
    const invalidUrls = [
      'https://github.com/zeit',
      'https://github.com',
      'https://github.com/',
      'https://github.com/zeit/',
      'https://github.com/zeit/next.js/tree/canary/',
      'https://github.com/zeit/next.js/tree/canary',
      'https://github.com/segmentio/is-url/valid'
    ];
    invalidUrls.forEach(url => expect(isValidRepoUrl(url)).toEqual(false));
  });

  test('isSpecificFolder', () => {
    const folders = [
      'https://github.com/zeit/next.js/tree/canary/examples/custom-server-koa',
      'https://github.com/zeit/next.js/tree/master/examples/whatever',
      'https://github.com/zeit/next.js/tree/canary/examples/'
    ];
    folders.forEach(folder => {
      expect(isSpecificFolder(folder)).toEqual(true);
    });
  });

  test('is regular folder', () => {
    const regularUrls = [
      'https://github.com/zeit/next.js',
      'https://github.com/zeit/next.js/',
      'https://github.com/zeit/nextjs'
    ];

    regularUrls.forEach(url => {
      expect(isSpecificFolder(url)).toEqual(false);
    });
  });
});
