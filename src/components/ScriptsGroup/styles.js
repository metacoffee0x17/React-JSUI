import emotion from 'react-emotion';
import flex from 'styles/flex';

export const ScriptsGroup = emotion.div({
  margin: '20px 0'
});

export const Title = emotion.div({
  color: 'white',
  fontSize: 25,
  fontWeight: 600,
  textTransform: 'capitalize'
});

export const ScriptsList = emotion.div({
  ...flex.horizontal,
  ...flex.wrap,
  color: 'white',
  width: '100%'
});
