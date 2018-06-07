import React from 'react';
import 'global-css';

//storybook-helpers
import { wrappers } from 'storybook-helpers';
import { withKnobs } from '@storybook/addon-knobs/react';
import { Variants, variants } from 'storybook-helpers/variants';

//storybook
import { storiesOf } from '@storybook/react';

//components
import Button from './index';
import { BUTTONS, DARKEN, SHADOWS } from 'config/enums';

const stories = storiesOf('Button', module);

stories
  .addDecorator(wrappers.padding)
  .addDecorator(wrappers.backgrounds)
  .addDecorator(withKnobs);

const buttonVariants = {
  type: variants.fromEnum(BUTTONS),
  shadow: variants.fromEnum(SHADOWS),
  darken: variants.fromEnum(DARKEN),
  disabled: variants.boolean(['disabled', 'enabled']),
  caps: variants.boolean(['caps', 'no caps'])
};

const variantStyles = {
  spaceBetweenVariants: 31,
  spaceBetweenGroups: 36,
  columns: 4,
  displayVariantName: true,
  displayGroupName: true,
  centerVariantName: true
};

stories.add('Button', () => {
  return (
    <Variants defaultStyles={variantStyles} variants={buttonVariants}>
      {({ props, name }, { groupName }) => (
        <Button {...props}> {groupName === 'combined' ? 'Button' : name} </Button>
      )}
    </Variants>
  );
});
