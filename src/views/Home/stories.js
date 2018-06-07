import React from 'react';
import 'global-css';

//utils
import uuid from 'uuid';
import faker from 'faker';
import times from 'lodash/times';

//storybook-helpers
import { wrappers } from 'storybook-helpers';
import { withKnobs, number, boolean } from '@storybook/addon-knobs/react';

//storybook
import { storiesOf } from '@storybook/react';

//components
import Home from './index';

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const stories = storiesOf('Home', module);

const getProjects = (groupNum, projectNum) =>
  times(groupNum, () => ({
    name: faker.commerce.department(),
    id: uuid.v4(),
    projects: times(projectNum, () => ({
      name: faker.hacker.noun().capitalize(),
      id: uuid.v4()
    }))
  }));

let provideStore = () => {
  const hasProjects = boolean('Has projects', false);
  const collapsed = boolean('Collapsed', false);
  const min = 1;
  const max = 15;

  const range = {
    range: true,
    min,
    max
  };

  const groupNum = number('groups', min, range);
  const projectNum = number('projects', min, range);
  const groupsWithProjects = hasProjects ? getProjects(groupNum, projectNum) : [];

  return { hasProjects, collapsed, groupsWithProjects };
};

stories
  .addDecorator(wrappers.padding)
  .addDecorator(wrappers.backgrounds)
  .addDecorator(wrappers.provideStore(provideStore))
  .addDecorator(withKnobs)
  .add('Home route', () => <Home />);
