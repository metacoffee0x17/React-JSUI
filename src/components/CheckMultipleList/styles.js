import emotion from 'react-emotion';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import flex from 'styles/flex';
import { whiteish } from 'styles/mixins';
import { colors } from 'styles/colors';

import ToggleIcon from 'components/ToggleIcon';

export const Checkbox = emotion(FontAwesomeIcon)();

export const CheckMultipleList = emotion.div();

export const CheckMultipleListItem = emotion.div({
  cursor: 'pointer',
  marginLeft: '-2rem',
  marginRight: '-2rem',
  padding: '.3rem 2rem',
  '&:hover': {
    backgroundColor: colors.purple1,
  },
})

export const Name = emotion.div(
  {
    color: 'white',
    fontSize: 14,
    userSelect: 'none',
  },
);
