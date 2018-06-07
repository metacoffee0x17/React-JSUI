import React from 'react';
import 'global-css';

//utils
import faker from 'faker';
import times from 'lodash/times';

//storybook
import { storiesOf } from '@storybook/react';
import { wrappers } from 'storybook-helpers';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
//components
import Terminal from './index';
import { Variants, variants } from 'storybook-helpers/variants';

/* ============================== STORIES ==================================== */

const stories = storiesOf('Terminal', module);

stories
  .addDecorator(wrappers.padding)
  .addDecorator(withKnobs)
  .addDecorator(wrappers.store({}))
  .addDecorator(wrappers.backgrounds);

/* ============================== KNOB IT ==================================== */

stories.add('knob it', () => {
  const createKnobs = ({
    output = `
      hello
      world
      how
      are
      you
    `
  } = {}) => ({
    output: text('output', output)
  });

  let { ...process } = createKnobs();

  return <Terminal process={process} />;
});

/* ============================== VARIANTS ==================================== */

const variantStyles = {
  spaceBetweenVariants: 24,
  spaceBetweenGroups: 150,
  columns: 1,
  displayVariantName: true,
  displayGroupName: true,
  centerVariantName: false
};

const varz = {
  output: variants.string([times(50, () => faker.lorem.sentence()).join('\n'), 'Short text'])
};

stories.add('Variants', () => (
  <Variants defaultStyles={variantStyles} variants={varz}>
    {({ name, props }) => (
      <Terminal
        process={{
          output: `default output`,
          ...props
        }}
      />
    )}
  </Variants>
));
