import React from 'react';

import times from 'lodash/times';
import faker from 'faker';

//storybook
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number, boolean, select } from '@storybook/addon-knobs';
import { wrappers } from 'storybook-helpers';
import flex from 'styles/flex';

//components
import Processes from './index';
import { Variants, variants } from 'storybook-helpers/variants';
import { text } from '@storybook/addon-knobs/react';
import { PROCESS_STATUS } from 'config/enums';

const stories = storiesOf('Processes');

stories.addDecorator(wrappers.backgrounds).addDecorator(withKnobs);

const createKnobs = ({
  running = true,
  path = 'webdev/kitze/projects',
  argz = ['start', '--dev'],
  output = `
      hello
      world
      how
      are
      you
    `
} = {}) => ({
  running: boolean('running', running),
  fullCommand: text('Full command', 'yarn start'),
  path: text('path', path),
  argz: text('argz', argz),
  output: text('output', output),
  setActive: action('setting active'),
  numberOfProcesses: number('Processes', 3),
  selectedId: number('Selected', 0),
  minimized: boolean('Minimized', false),
  status: select('Status', Object.values(PROCESS_STATUS), PROCESS_STATUS.RUNNING)
});

stories.add('knob', () => {
  let knobs = createKnobs();

  //overrides
  const { minimized } = knobs;
  //for parent
  const { selectedId, numberOfProcesses } = knobs;
  //actions
  const { setActive } = knobs;
  //for children
  const { fullCommand, status } = knobs;

  return (
    <div
      style={{
        height: 600,
        border: '1px solid red',
        ...flex.vertical
      }}
    >
      <div style={{ flex: 1 }}> Top things</div>

      <Processes
        overrides={{
          minimized
        }}
        processes={{
          selectedId,
          setActive: setActive,
          isActive: () => 1,
          selectedProcess: {},
          list: times(numberOfProcesses, id => ({
            fullCommand,
            id,
            status,
            output: times(10, faker.lorem.sentence()).join('\n')
          }))
        }}
      />
    </div>
  );
});

const varz = {
  selectedId: variants.create([0, 1, 2]),
  listNumber: variants.create([0, 1, 2]),
  minimized: variants.boolean(['minimized', 'maximized'])
};

const stylez = {
  spaceBetweenVariants: 14,
  spaceBetweenGroups: 96,
  columns: 1,
  displayVariantName: false,
  displayGroupName: true,
  centerVariantName: false
};

stories.add('variants', () => (
  <Variants defaultStyles={stylez} variants={varz}>
    {({ name, props: { minimized, selectedId = 0, listNumber = 3 } }) => (
      <Processes
        overrides={{
          minimized
        }}
        processes={{
          selectedProcess: {},
          selectedId: selectedId,
          setActive: () => {},
          status: PROCESS_STATUS.RUNNING,
          list: times(listNumber, id => ({
            fullCommand: 'yarn start',
            id,
            output: times(10, () => faker.lorem.sentence()).join('\n')
          }))
        }}
      />
    )}
  </Variants>
));
