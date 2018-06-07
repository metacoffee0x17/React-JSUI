import React, { Component } from 'react';
import { Field, Form } from 'react-final-form';
import { InputAdapter } from 'adapters';
//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import { BUTTONS } from 'config/enums';
import { isEmptyString, isLowerCase } from 'utils/string-utils';
import { FORM_ERROR } from 'final-form';

const validateForm = values => {
  const fields = {
    name: v => !isEmptyString(v),
    version: v => (v === '' || !v ? true : !v.includes(' ') && isLowerCase(v))
  };

  const valid = ['name', 'version'].every(f => fields[f](values[f]));

  return {
    ...(!valid && { [FORM_ERROR]: valid })
  };
};

class InstallDependencyForm extends Component {
  render() {
    const { isDev, onSubmit, onCancel } = this.props;

    return (
      <Form validate={validateForm} onSubmit={() => {}}>
        {({ invalid, values }) => {
          return (
            <S.InstallDependencyForm>
              <A.TopFlex>
                <h1> {`Install a ${isDev ? 'dev ' : ' '}dependency`} </h1>
                <A.Vertical flex={1} spaceAll={15}>
                  <Field autoFocus placeholder="Name" name="name" component={InputAdapter} />
                  <Field name="version" placeholder="Version (optional)" component={InputAdapter} />
                </A.Vertical>
              </A.TopFlex>
              <A.Horizontal spaceAll={15} justifyEnd>
                <A.Button onClick={onCancel} type={BUTTONS.DANGER}>
                  Cancel
                </A.Button>
                <A.Button
                  onClick={() => onSubmit({ ...values, isDev })}
                  disabled={invalid}
                  type={BUTTONS.PRIMARY}
                >
                  Install
                </A.Button>
              </A.Horizontal>
            </S.InstallDependencyForm>
          );
        }}
      </Form>
    );
  }
}

export default InstallDependencyForm;
