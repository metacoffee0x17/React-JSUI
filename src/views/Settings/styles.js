import emotion from 'react-emotion';

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
  Wrap: emotion.div({
    marginBottom: 30
  }),
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
