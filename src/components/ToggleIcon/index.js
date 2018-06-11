import React from 'react';
import emotion from 'react-emotion';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { whiteish } from 'styles/mixins';

export const Icon = emotion(FontAwesomeIcon)(
  {
    color: whiteish(0.7),
    cursor: 'pointer',
    transition: 'color 150ms linear',
    '&:hover': {
      color: whiteish(0.8)
    },
    '&:active': {
      color: whiteish(1)
    }
  },
  ({ inactive }) => ({
    ...(inactive && {
      color: whiteish(0.3)
    })
  })
);

export default ({ onIcon, offIcon, active, ...rest }) => <Icon {...rest} icon={active ? onIcon : offIcon} />;
