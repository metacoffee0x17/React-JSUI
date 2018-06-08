import emotion from 'react-emotion';
import flex from 'styles/flex';
import { fixedHeight, whiteish } from 'styles/mixins';
import IconWithTip from 'components/IconWithTip';

import { Horizontal as $Horizontal, Vertical as $Vertical } from 'styles/flex-components';

export const Horizontal = $Horizontal;
export const Vertical = $Vertical;

export const DialogContent = emotion.div({
  padding: 15,
  ...flex.vertical,
  flex: 1
});

export const SmallButton = emotion.div({
  ...flex.horizontal,
  ...flex.centerHorizontalH,
  borderRadius: 3,
  padding: `4px 5px`,
  backgroundColor: whiteish(0.3),
  color: 'white',
  fontSize: 10,
  lineHeight: '10px',
  transition: '150ms linear all',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: whiteish(0.4)
  }
});

export const TopFlex = emotion.div({
  ...flex.vertical,
  flex: 1
});

export const Mid = emotion.div({
  ...flex.vertical,
  overflowY: 'auto',
  flex: 1,
  padding: 15,
  '& > *': {
    flexShrink: 0
  }
});

export const Button = require('./Button').default;

export const spaceUnit = 5;

export const Space = emotion.div(({ size = 1 } = {}) => ({
  ...fixedHeight(spaceUnit * size)
}));

export const ActionIcon = emotion(IconWithTip)({
  color: whiteish(0.7),
  transition: 'color 200ms linear',
  '&:hover': {
    color: whiteish(0.9)
  }
});

export const Padding = emotion.div({
  padding: 15
});

export const Block = {
  Wrap: emotion.div({
    ...flex.vertical,
    ...flex.centerVerticalV,
    minHeight: 70,
    padding: 15,
    backgroundColor: whiteish(0.1),
    color: 'white',
    marginRight: 15,
    marginBottom: 15,
    borderRadius: 3,
    transition: 'all 100ms linear',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: whiteish(0.2)
    }
  }),
  Name: emotion.div({
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 15
  }),
  Description: emotion.div({
    fontSize: 14,
    fontWeight: 100
  })
};
