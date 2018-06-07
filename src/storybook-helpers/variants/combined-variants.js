import { product } from 'utils/combinatorics';

const getCombinedVariants = variantsList =>
  product(variantsList.map(v => v.variants)).map(v => ({
    name: v.reduce((accum, a) => {
      accum += ` ${a.name}`;
      return accum;
    }, ``),
    props: v.reduce((accum, a) => {
      accum = { ...accum, ...a.props };
      return accum;
    }, {})
  }));

export default getCombinedVariants;
