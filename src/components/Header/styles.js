import emotion from 'react-emotion';
import flex from 'styles/flex';

export const Header = emotion.div({
  ...flex.horizontal,
  ...flex.centerHorizontalV,
  ...flex.spaceBetween,
  width: '100%',
  minHeight: 50,
  backgroundColor: '#2b2e3c',
  padding: 15,
  color: 'white'
});
