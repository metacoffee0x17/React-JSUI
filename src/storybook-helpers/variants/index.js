import React from 'react';

import withVariantsHOC from './with-variants-hoc';
import variantsModule from './creators';
import VariantsModule from './Variants';

export const Variants = VariantsModule;
export const variants = variantsModule;
export const withVariants = withVariantsHOC;
