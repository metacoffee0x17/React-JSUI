import emotion from 'react-emotion';
import flex from 'styles/flex';
import { Vertical } from 'styles/flex-components';
import { whiteish } from 'styles/mixins';

export const Group = emotion(Vertical)(
  {
    backgroundColor: whiteish(0.05),
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    color: 'white',
    transition: 'all 150ms linear'
  },
  ({ collapsed }) => ({
    ...(collapsed && {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#55647d'
      }
    })
  })
);

export const ProjectList = emotion.div({
  ...flex.horizontal,
  ...flex.wrap
});

export const Name = emotion.div({
  fontWeight: 'bold',
  marginBottom: 15
});
