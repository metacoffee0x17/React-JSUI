export const bindStateToField = (stateInstance, fieldName) => {
  return {
    onChange: e => stateInstance.setState({ [fieldName]: e.target.value }),
    value: stateInstance[fieldName]
  };
};

export const bindStringToInput = str => ({
  onChange: e => str.setValue(e.target.value),
  value: str.value
});