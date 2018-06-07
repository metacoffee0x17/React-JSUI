import React from 'react';

const withContext = (Context, name = 'contextProps') => Component => props => (
  <Context.Consumer>{value => <Component {...{ [name]: value }} {...props} />}</Context.Consumer>
);

export const createContext = (name, defaultValue, { wrap = comp => comp } = {}) => {
  const CreatedContext = React.createContext(defaultValue);

  return {
    name,
    wrap: Component => withContext(CreatedContext, name)(wrap(Component)),
    Consumer: CreatedContext.Consumer,
    Provider: CreatedContext.Provider
  };
};
