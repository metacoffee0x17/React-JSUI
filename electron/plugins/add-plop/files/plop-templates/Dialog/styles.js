import emotion from 'emotion';

import Dialog from 'components/Dialog';
import flex from 'styles/flex';
import {defaultPadding} from 'styles/vars';

export const {{properCase name}} = emotion(Dialog)({
  ...flex.vertical
});

export const Content = emotion.div({
  ...flex.vertical,
  padding: defaultPadding,
  flex: 1
});

export const Top = emotion.div({
  ...flex.vertical,
  flex: 1
});