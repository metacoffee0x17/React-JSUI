import emotion from 'react-emotion';
import flex from 'styles/flex';

export const Sidebar = emotion.div({
  ...flex.vertical,
  width: 260,
  backgroundColor: '#1b1d2a',
  height: '100vh',
  color: 'white',
  padding: 15,
  overflowY: 'scroll',
  overflowX: 'hidden',
});
