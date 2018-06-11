import emotion, { css } from 'react-emotion';

import { Switch as $Switch } from '@material-ui/core';
import withProps from 'recompose/withProps';

export const Switch = withProps({
  classes: {
    root: css({
      position: 'relative',
      left: -10,
      marginRight: -10
    })
  }
})($Switch);

export const Settings = emotion.div({
  color: 'rgba(0,0,0,0.5)'
});

export const Content = emotion.div({
  padding: 15
});

export const Title = emotion.div({
  fontWeight: 'bold',
  marginBottom: 15,
  color: 'white',
  fontSize: 20
});

export const Option = {
  Title: emotion.div({
    marginBottom: 5,
    color: 'white',
    fontSize: 15
  }),
  Description: emotion.div({
    color: 'white',
    fontSize: 12
  })
};
