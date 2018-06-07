import React from 'react';
import { storiesOf } from '@storybook/react';
import { action, configureActions } from '@storybook/addon-actions';

import Tabs from './index';
import Tab from 'components/Tab';
import Terminal from 'components/Terminal';
import { wrappers } from 'storybook-helpers';

const stories = storiesOf('Tabs');

stories.addDecorator(wrappers.backgrounds).addDecorator(wrappers.padding);

stories.add('knobs', () => {
  const click = action('select a tab');

  return (
    <Tabs value={2} onSelect={tab => click(tab.props.title)}>
      <Tab value={1} title="First">
        <Terminal
          process={{
            output: 'Whatever'
          }}
        />
      </Tab>
      <Tab value={2} title="Second">
        <Terminal
          process={{
            output: 'Whatever'
          }}
        />
      </Tab>
      <Tab value={3} title="Second">
        <Terminal
          process={{
            output: 'Whatever'
          }}
        />
      </Tab>
    </Tabs>
  );
});
