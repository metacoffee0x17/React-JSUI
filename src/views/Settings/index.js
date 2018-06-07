import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch } from '@material-ui/core';
import { Input } from 'styles/material-ui-overrides';

import * as S from './styles';
import * as A from 'styles/shared-components';

@inject('store')
@observer
class Settings extends Component {
  render() {
    const { store, onSave } = this.props;
    const { settings } = store;

    return (
      <S.Settings>
        <S.Content>
          <S.Title> Settings </S.Title>

          <S.Option.Wrap>
            <S.Option.Title>Default projects path</S.Option.Title>
            <Input
              onChange={e => settings.changePath(e.target.value)}
              value={settings.projectsPath}
              type="text"
            />
          </S.Option.Wrap>

          <S.Option.Wrap>
            <S.Option.Title>Editor cli</S.Option.Title>
            <Input
              onChange={e => settings.changeEditor(e.target.value)}
              value={settings.editor}
              type="text"
            />
          </S.Option.Wrap>

          <S.Option.Wrap>
            <A.Horizontal centerV>
              <S.Option.Title>List project files</S.Option.Title>
              <Switch
                checked={settings.indexFiles}
                value={settings.indexFiles}
                onChange={(e, checked) => {
                  settings.setIndexFiles(checked);
                }}
              />
            </A.Horizontal>
            <S.Option.Description>It might slow down with bigger projects</S.Option.Description>
          </S.Option.Wrap>

          <A.Button disabled={!settings.valid} onClick={onSave}>
            Save
          </A.Button>
        </S.Content>
      </S.Settings>
    );
  }
}

export default Settings;
