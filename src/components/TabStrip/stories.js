import React from 'react';
import times from 'lodash/times';

//storybook
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number, boolean, text } from '@storybook/addon-knobs';
import { wrappers } from 'storybook-helpers';

//components
import TabStrip from './index';
import ProcessTab from 'components/Processes/components/ProcessTab';
import { PROCESS_STATUS } from 'config/enums';

const stories = storiesOf('TabStrip');

stories
  .addDecorator(wrappers.backgrounds)
  .addDecorator(wrappers.padding)
  .addDecorator(withKnobs);

stories.add('default', () => {
  return (
    <TabStrip
      tabs={[
        {
          title: 'First',
          selected: true
        },
        {
          title: 'Second',
          value: 2
        },
        {
          title: 'Third',
          value: 3
        }
      ]}
    />
  );
});

stories.add('with processes', () => {
  const numberOfTabs = number('number', 3);

  const composedProps = () => ({
    tabs: times(numberOfTabs, t => ({
      withPadding: false,
      title: (
        <ProcessTab
          status={PROCESS_STATUS.RUNNING}
          onStop={action('stop')}
          title={text('title', 'yarn start')}
        />
      ),
      value: 1
    }))
  });

  return <TabStrip {...composedProps()} />;
});
