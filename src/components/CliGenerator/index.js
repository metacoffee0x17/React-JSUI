import React, { Component, Fragment } from 'react';
import { typeToAdapterMap } from 'generators/field-types';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { DEFAULT_FIELDS } from 'generators/field-types';
import { observer, inject } from 'mobx-react';
import { isEmptyString, isLowerCase } from 'utils/string-utils';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import { InputAdapter } from 'adapters';
import { BUTTONS, SHADOWS } from 'config/enums';

class Option extends Component {
  componentWillUnmount() {
    this.props.change(this.props.option.key, null);
  }

  render() {
    const { option = {}, autoFocus, values, change } = this.props;
    const adapter = typeToAdapterMap[option.type];

    return (
      <Fragment>
        <Field
          placeholder={option.name}
          autoFocus={autoFocus}
          name={option.key}
          component={adapter}
          option={option}
        />
        {option.children && <OptionChildren change={change} values={values} option={option} />}
      </Fragment>
    );
  }
}

const OptionChildren = ({ option, values, change }) => {
  const value = values[option.key];
  const passesCondition = option.children.condition ? option.children.condition(value) : true;

  if (passesCondition) {
    return (
      <A.Vertical spaceAll={10}>
        {option.children.list.map(opt => (
          <Option change={change} values={values} option={opt} key={opt.key} />
        ))}
      </A.Vertical>
    );
  }

  return null;
};

let validateForm = formValues => {
  const allFieldsValid = [DEFAULT_FIELDS.NAME, DEFAULT_FIELDS.PATH].every(f => {
    const field = formValues[f];
    return !isEmptyString(field) && !field.includes(' ');
  });
  const pathIsValid = isLowerCase(formValues[DEFAULT_FIELDS.NAME]);
  const valid = allFieldsValid && pathIsValid;
  return {
    ...(!valid && { [FORM_ERROR]: valid })
  };
};

@inject('store')
@observer
class CliGenerator extends Component {
  render() {
    const { store, generator, onSubmit, initialValues, onCancel } = this.props;
    const { options } = generator;

    const finalInitialValues = {
      path: store.settings.projectsPath,
      ...initialValues
    };

    return (
      <S.CliGenerator>
        <S.Title>{generator.name}</S.Title>
        <S.Subtitle>{generator.description}</S.Subtitle>
        <Form validate={validateForm} initialValues={finalInitialValues} onSubmit={() => {}}>
          {({ handleSubmit, form: { change }, reset, pristine, invalid, submitting, values }) => {
            return (
              <A.Vertical flex={1}>
                <A.TopFlex>
                  <A.Vertical spaceAll={20}>
                    <Field autoFocus placeholder="Name" name={DEFAULT_FIELDS.NAME} component={InputAdapter} />
                    <Field name={DEFAULT_FIELDS.PATH} placeholder="Path" component={InputAdapter} />
                    {options.map(option => (
                      <Option change={change} key={option.key} values={values} option={option} />
                    ))}
                  </A.Vertical>
                </A.TopFlex>
                <A.Horizontal justifyEnd spaceAll={15}>
                  <A.Button type={BUTTONS.DANGER} onClick={onCancel}>
                    Cancel
                  </A.Button>
                  <A.Button disabled={invalid} shadow={SHADOWS.NONE} onClick={() => onSubmit(values)}>
                    Create
                  </A.Button>
                </A.Horizontal>
              </A.Vertical>
            );
          }}
        </Form>
      </S.CliGenerator>
    );
  }
}

export default CliGenerator;
