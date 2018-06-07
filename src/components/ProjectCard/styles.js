import emotion from 'react-emotion';
import flex from 'styles/flex';
import { size } from 'styles/mixins';

//components
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export const ProjectCard = emotion.div(
  {
    ...flex.vertical,
    ...flex.spaceBetween,
    display: 'flex',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: 3,
    minWidth: 150,
    minHeight: 100,
    padding: 15,
    marginBottom: 15,
    marginRight: 15,
    color: 'white',
    maxWidth: 330
  },
  ({ markRed }) => ({
    ...(markRed && {
      border: '1px solid #ea9797'
    })
  })
);

export const Icon = emotion(FontAwesomeIcon)(
  {
    ...size(18),
    cursor: 'pointer'
  },
  ({ color }) => ({
    color: color || 'white'
  })
);

export const Name = emotion.div({
  marginBottom: 10,
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline'
  }
});

export const Tag = emotion.div({
  backgroundColor: '#6c86fb',
  padding: '3px 5px',
  borderRadius: 3,
  fontSize: 12,
  color: 'white'
});
