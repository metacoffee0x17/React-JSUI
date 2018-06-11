import emotion from 'react-emotion';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import flex from 'styles/flex';

export const Checkbox = emotion(FontAwesomeIcon)({
  cursor: 'pointer'
});

export const CheckMultipleList = emotion.div({});

export const Name = emotion.div(
  {
    color: 'white',
    fontSize: 14,
    userSelect: 'none',
    cursor: 'default'
  },
  ({ onClick }) => ({
    ...(onClick && {
      cursor: 'pointer'
    })
  })
);
