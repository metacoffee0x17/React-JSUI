export const bindStateToField = (stateInstance, fieldName) => {
  return {
    onChange: e => stateInstance.setState({ [fieldName]: e.target.value }),
    value: stateInstance[fieldName]
  };
};
