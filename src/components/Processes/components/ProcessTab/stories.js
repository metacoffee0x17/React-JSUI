import React from 'react';

//storybook
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { wrappers } from 'storybook-helpers';

//components
import ProcessTab from './index';
import { Tab } from 'components/TabStrip/styles';

import { PROCESS_STATUS } from 'config/enums';

const stories = storiesOf('ProcessTab');

stories
  .addDecorator(wrappers.backgrounds)
  .addDecorator(wrappers.padding)
  .addDecorator(withKnobs);

stories.add('default', () => {
  return (
    <div style={{ maxWidth: 120 }}>
      <Tab withPadding={false}>
        <ProcessTab title="Process" status={PROCESS_STATUS.STOPPED} />
      </Tab>
    </div>
  );
});
