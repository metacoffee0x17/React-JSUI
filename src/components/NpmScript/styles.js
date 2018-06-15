import emotion from 'react-emotion';
import flex from 'styles/flex';
import { whiteish } from 'styles/mixins';
import $ToggleIcon from 'components/ToggleIcon';

export const NpmScript = emotion.div({
  ...flex.vertical,
  backgroundColor: whiteish(0.05),
  borderRadius: 5,
  padding: 10,
  marginBottom: 15,
  color: 'white',
  marginRight: 10,
  transition: 'all 100ms linear',
  cursor: 'pointer',
  minWidth: 180,
  '&:hover': {
    transform: `scale(${1.01})`,
    backgroundColor: whiteish(0.1)
  }
});

export const Definition = emotion.div({});

export const ToggleIcon = emotion($ToggleIcon)({});

export const Name = emotion.div({
  fontSize: 15
});

export const Description = emotion.div({
  fontSize: 14,
  marginBottom: 9,
  color: 'rgb(135, 156, 195)'
});
