import emotion from 'react-emotion';
import flex from 'styles/flex';

export const ScriptsList = emotion.div(
  {
    ...flex.horizontal,
    ...flex.wrap
  },
  ({ vertical }) => ({
    ...(vertical && {
      ...flex.vertical
    })
  })
);
