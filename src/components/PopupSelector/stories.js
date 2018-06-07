import React from 'react';
import uuid from 'uuid';
import times from 'lodash/times';

import faker from 'faker';

//storybook
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import { wrappers } from 'storybook-helpers';

//components
import PopupSelector from './index';

const stories = storiesOf('PopupSelector');

stories
  .addDecorator(wrappers.backgrounds)
  .addDecorator(wrappers.padding)
  .addDecorator(withKnobs);

stories.add('default', () => {
  //knobs
  const items = number('Item number', 3, { range: true, min: 0, max: 20 });
  const showSearch = boolean('Show search', true);

  return (
    <PopupSelector
      showSearch={showSearch}
      items={times(items, i => ({
        name: faker.lorem.sentence(),
        id: uuid.v4()
      }))}
      inPortal={false}
    />
  );
});
