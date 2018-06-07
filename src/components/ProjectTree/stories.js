import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import data from './data.json';
import LessonCode from './index';

storiesOf('LessonCode').add('default', () => {
  return <LessonCode onSelect={action('selecting this')} contents={data} />;
});
