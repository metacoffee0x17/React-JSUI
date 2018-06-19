import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { faTrash } from '@fortawesome/fontawesome-free-solid';
import { types } from 'mobx-state-tree';
import pullAt from 'lodash/pullAt';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import { BUTTONS } from 'config/enums';
import { isValidString } from 'utils/string-utils';

const Model = types
  .model('ScriptsModel', {
    name: '',
    description: '',
    fullCommand: '',
    listOfCommands: types.optional(types.array(types.string), [])
  })
  .actions(self => ({
    removeCommand(index) {
      pullAt(self.listOfCommands, [index]);
    },
    addCommand() {
      self.listOfCommands.push('');
    },
    changeCommand(index, value) {
      self.listOfCommands[index] = value;
    },
    changeInput: (inputName, value) => {
      self[inputName] = value;
    },
    bindCommandToInput: index => ({
      onChange: e => self.changeCommand(index, e.target.value),
      value: self.listOfCommands[index]
    }),
    bindInput: inputName => ({
      onChange: e => {
        self.changeInput(inputName, e.target.value);
      }
    }),
    afterCreate() {
      self.listOfCommands = self.fullCommand.split('&&').map(a => a.trim());
    }
  }))
  .views(self => ({
    get finalCommand() {
      return self.listOfCommands.join(' && ');
    },
    get valid() {
      return (
        isValidString(self.name) && self.listOfCommands.every(isValidString) && self.listOfCommands.length > 0
      );
    }
  }));

@inject('store')
@observer
class ScriptEditingDialog extends Component {
  model = Model.create({
    fullCommand: this.props.fullCommand,
    name: this.props.name,
    description: this.props.description
  });

  render() {
    const { scriptName, onSave, onCancel } = this.props;
    const { listOfCommands } = this.model;

    let addingNewScript = !scriptName;

    return (
      <S.ScriptEditingDialog>
        <A.TopFlex>
          <A.Vertical>
            {scriptName && <h3>Editing {scriptName}</h3>}

            {addingNewScript && <h3>Add a script</h3>}

            <A.TextInput
              placeholder="Name"
              autoFocus
              value={this.model.name}
              {...this.model.bindInput('name')}
            />
            <A.Space size={3} />
            <A.TextInput
              placeholder="Description"
              value={this.model.description}
              {...this.model.bindInput('description')}
            />
            <h3>Commands</h3>

            <A.Vertical spaceBottom={true} spaceAll={15}>
              {listOfCommands.map((command, index) => (
                <A.Horizontal spaceBetween>
                  <A.Horizontal spaceAll={15} centerV>
                    <A.ActionIcon onClick={() => this.model.removeCommand(index)} icon={faTrash} />
                  </A.Horizontal>
                  <A.Space size={3} />
                  <A.TextInput
                    {...this.model.bindCommandToInput(index)}
                    styles={{ flex: 1 }}
                    type="text"
                    value={command}
                    autoFocus={!addingNewScript || index > 0}
                  />
                </A.Horizontal>
              ))}
              <A.Button styles={{ alignSelf: 'flex-start' }} onClick={this.model.addCommand}>
                Add command
              </A.Button>
            </A.Vertical>
          </A.Vertical>
        </A.TopFlex>
        <A.Horizontal spaceAll={15} justifyEnd centerV>
          <A.Button onClick={onCancel} type={BUTTONS.DANGER}>
            Cancel
          </A.Button>
          <A.Button
            type={BUTTONS.PRIMARY}
            onClick={() => onSave(this.model.finalCommand, this.model.name, this.model.description)}
            disabled={!this.model.valid}
          >
            Save
          </A.Button>
        </A.Horizontal>
      </S.ScriptEditingDialog>
    );
  }
}

export default ScriptEditingDialog;
