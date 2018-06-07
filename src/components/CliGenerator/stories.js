import React from 'react';

//storybook
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { wrappers } from 'storybook-helpers';

//components
import CliGenerator from './index';

const stories = storiesOf('CliGenerator');

stories
  .addDecorator(wrappers.backgrounds)
  .addDecorator(wrappers.padding)
  .addDecorator(withKnobs);

stories.add('default', () => {
  return (
    <CliGenerator/>
  );
});
