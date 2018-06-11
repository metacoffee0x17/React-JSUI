import emotion from 'react-emotion';
import flex from 'styles/flex';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export const CollapseIcon = emotion(FontAwesomeIcon)({
  color: 'white'
});

export const CollapsibleSection = emotion.div({
  userSelect: 'none',
  cursor: 'default'
});
