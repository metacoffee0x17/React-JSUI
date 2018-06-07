import React from 'react';
import withVariants from './variants/with-variants-hoc';
import { wrappers } from 'storybook-helpers/index';
import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import 'global-css';

export default (Comp, name, variantProps) => {
  const stories = storiesOf(name, module);

  stories.addDecorator(withKnobs).addDecorator(wrappers.backgrounds);

  /* ============================== KNOB IT ==================================== */

  stories.add('knobs', () => <Comp {...Comp.getKnobs()} />);

  /* ============================== VARIANTS ==================================== */

  stories.add('variants', () => withVariants(Comp, variantProps));
};
