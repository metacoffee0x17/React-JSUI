import React, { Component } from 'react';
import { TextField } from 'styles/material-ui-overrides';

//styles
import * as A from 'styles/shared-components';
import { BUTTONS } from 'config/enums';
import { isEmptyString } from 'utils/string-utils';

class ImportWebUrl extends Component {
  state = {
    name: '',
    url: ''
  };

  bindToState = name => ({
    value: this.state[name],
    onChange: e => this.setState({ [name]: e.target.value })
  });

  render() {
    const { onSubmit, onCancel } = this.props;
    const { name, url } = this.state;

    const valid = !isEmptyString(url) && !isEmptyString(name);

    return (
      <A.DialogContent>
        <A.TopFlex>
          <h1>Import a web project</h1>
          <A.Space />
          <A.Space size={3} />
          <TextField autoFocus placeholder="Name" {...this.bindToState('name')} />
          <A.Space size={3} />
          <TextField placeholder="URL" {...this.bindToState('url')} />
        </A.TopFlex>

        <A.Horizontal spaceAll={15} justifyEnd>
          <A.Button type={BUTTONS.DANGER} onClick={onCancel}>
            Cancel
          </A.Button>
          <A.Button disabled={!valid} type={BUTTONS.PRIMARY} onClick={() => onSubmit(this.state)}>
            Done
          </A.Button>
        </A.Horizontal>
      </A.DialogContent>
    );
  }
}

export default ImportWebUrl;
