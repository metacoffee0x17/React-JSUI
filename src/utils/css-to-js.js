export default input =>
  input
    .replace(/-([a-z])/g, g => g[1].toUpperCase())
    .replace(/: (.*?);/g, ": '$1',")
    .replace(/\n *?(\w)/g, '\n$1')
    .replace(/\n{2,}/g, '\n')
    .replace(/'(-?\d+)px'/g, '$1');
