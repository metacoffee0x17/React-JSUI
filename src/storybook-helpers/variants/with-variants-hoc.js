import React from 'react';
import Variants from './Variants';

const withVariants = (Comp, { nameProp = 'name', defaultStyles = {} } = {}) => (
  <Variants defaultStyles={defaultStyles} variants={Comp.Variants}>
    {({ name, props }) => (
      <Comp
        {...{
          ...props,
          [nameProp]: name
        }}
      />
    )}
  </Variants>
);

export default withVariants;
