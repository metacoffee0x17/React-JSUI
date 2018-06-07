import React from 'react';

//storybook
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { wrappers } from 'storybook-helpers';

//components
import Folder from './index';

const stories = storiesOf('Folder');

stories
  .addDecorator(wrappers.backgrounds)
  .addDecorator(wrappers.padding)
  .addDecorator(withKnobs);

stories.add('default', () => {
  return (
    <Folder
      folder={{
        name: 'Folder name',
        contents: [
          { name: 'index.js' },
          { name: 'whatever.js' },
          { name: 'jumbo.js' },
          {
            name: 'Folder 2',
            contents: [
              { name: 'duhboy' },
              { name: 'index.css' },
              {
                name: 'Folder 3',
                contents: [{ name: 'nested.js' }]
              }
            ]
          }
        ]
      }}
    />
  );
});
