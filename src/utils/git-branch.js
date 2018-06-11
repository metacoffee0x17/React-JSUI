const fs = require('fs');
const find = require('findup-sync');

const parseBranch = buf => {
  const match = /ref: refs\/heads\/([^\n]+)/.exec(buf.toString());
  return match ? match[1] : null;
};

const gitHeadPath = cwd => {
  const filepath = find('.git/HEAD', { cwd: cwd || process.cwd() });
  if (!fs.existsSync(filepath)) {
    throw new Error('.git/HEAD does not exist');
  }
  return filepath;
};

export default cwd => {
  return parseBranch(fs.readFileSync(gitHeadPath(cwd)));
};
