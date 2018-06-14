import React, { Component } from 'react';
import { Field } from 'react-final-form';
import get from 'lodash/get';

//styles
import * as A from 'styles/shared-components';
import { BUTTONS } from 'config/enums';
import { getLastFromString, isValidString } from 'utils/string-utils';
import { CheckboxAdapter, InputAdapter } from 'adapters';
import { validateWithError, withForm } from 'utils/form-utils';
import { isSpecificFolder, isValidRepoUrl } from 'utils/github-utils';

@withForm({
  initialValues: { installDependencies: true, keepGit: false }
})
class ImportGithubUrl extends Component {
  componentDidUpdate(prevProps) {
    let nextUrl = get(this.props, 'form.values.url');
    let prevUrl = get(prevProps, 'form.values.url');
    if (prevUrl !== nextUrl) {
      let nameFromUrl = getLastFromString(nextUrl, '/', true);
      this.props.form.change('name', nameFromUrl);
    }
  }

  render() {
    const { onSubmit, onCancel, form } = this.props;
    const { values, valid } = form;
    const { url = '' } = values;

    const isFolder = isSpecificFolder(url);
    const isValidUrl = isValidRepoUrl(url);

    return (
      <A.DialogContent>
        <A.TopFlex>
          <h1>Import a GitHub project</h1>
          <div>You can also import to a specific folder.</div>
          <A.Space size={3} />
          <Field
            autoFocus
            name="url"
            placeholder="URL"
            validate={validateWithError(isValidRepoUrl)}
            component={InputAdapter}
          />
          <A.Space size={3} />
          <Field
            name="name"
            placeholder="Name"
            validate={validateWithError(isValidString)}
            component={InputAdapter}
          />

          <A.Space size={3} />

          <Field name="installDependencies" label="Install Dependencies" component={CheckboxAdapter} />

          <A.Space size={3} />

          {!isFolder &&
            isValidUrl && <Field name="keepGit" label="Keep .git folder" component={CheckboxAdapter} />}
        </A.TopFlex>

        <A.Horizontal spaceAll={15} justifyEnd>
          <A.Button type={BUTTONS.DANGER} onClick={onCancel}>
            Cancel
          </A.Button>
          <A.Button
            disabled={!valid}
            type={BUTTONS.PRIMARY}
            onClick={() => onSubmit({ ...values, isSpecificFolder: isFolder })}
          >
            Done
          </A.Button>
        </A.Horizontal>
      </A.DialogContent>
    );
  }
}

export default ImportGithubUrl;
