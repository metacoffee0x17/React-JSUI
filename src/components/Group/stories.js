import React from 'react';
import 'global-css';
import { wrappers } from 'storybook-helpers';
import { withKnobs, array, text, boolean } from '@storybook/addon-knobs/react';

//storybook
import { storiesOf } from '@storybook/react';

//components
import Group from './index';
import { PROJECT_TYPES } from 'config/enums';

const stories = storiesOf('Group', module);

stories
  .addDecorator(wrappers.padding)
  .addDecorator(withKnobs)
  .addDecorator(wrappers.store())
  .addDecorator(wrappers.backgrounds);

const getGroup = ({
  name = 'My group',
  projects = ['First', 'Second', 'Third'],
  collapsed = false
} = {}) => ({
  group: {
    name: text('Name', name),
    projects: array('Project list', projects, ',').map(name => ({
      name,
      type: PROJECT_TYPES.REACT_NATIVE
    }))
  },
  collapsed: boolean('Collapsed', collapsed)
});

stories.add('default group', () => <Group {...getGroup()} />);
