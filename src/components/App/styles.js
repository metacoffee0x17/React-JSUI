import emotion from 'react-emotion';
import flex from 'styles/flex';
import { UnControlled as CodeMirror } from 'react-codemirror2/index';

export const App = emotion.div({
  ...flex.vertical,
  flex: 1,
  width: '100vw',
  height: '100vh',
  maxHeight: '100vh',
  maxWidth: '100vw',
  overflowY: 'hidden',
  backgroundColor: '#343f55'
});

export const Editor = emotion(CodeMirror)({
  ...flex.vertical,
  flex: 1,
  '& .CodeMirror': {
    flex: 1,
    fontSize: 15
  }
});
