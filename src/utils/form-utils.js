import React from 'react';
import { Form } from 'react-final-form';

export const validateWithError = (errorCheckingFn, message = 'error') => value => {
  const result = errorCheckingFn(value);
  return result ? undefined : message;
};

export const withForm = formProps => Comp => props => (
  <Form {...formProps} onSubmit={() => {}}>
    {form => <Comp {...props} form={form} />}
  </Form>
);
