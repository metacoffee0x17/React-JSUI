import React from 'react';
import { App } from 'components/App/styles';
import { Provider } from 'mobx-react';
import backgrounds from '@storybook/addon-backgrounds';

const storeWrapper = (store = {}) => story => {
  return <Provider store={store}>{story()}</Provider>;
};
const paddingWrapper = getStory => {
  return <div style={{ padding: 20 }}>{getStory()}</div>;
};

const extraDivWrapper = div => getStory => {
  return (
    <div>
      <div id={div} />
      {getStory()}
    </div>
  );
};

const provideStoreWrapper = getStore => getStory => wrappers.store(getStore())(getStory);
const appWrapper = story => <App>{story()}</App>;
const backgroundsWrapper = backgrounds([
  { name: 'purple', value: '#343f55', default: true },
  { name: 'black', value: 'black' },
  { name: 'gray', value: '#424242' },
  { name: 'white', value: 'white' }
]);

export const wrappers = {
  store: storeWrapper,
  padding: paddingWrapper,
  provideStore: provideStoreWrapper,
  app: appWrapper,
  backgrounds: backgroundsWrapper,
  withExtraDiv: extraDivWrapper
};

export const data = {
  dependencies: require('./dependencies').default,
  devDependencies: require('./devDependencies').default
};
