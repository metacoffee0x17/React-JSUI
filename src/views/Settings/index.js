import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import * as S from './styles';
import * as A from 'styles/shared-components';
import { bindSwitchToMST } from 'utils/bind-utils';

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

          <S.Option.Title>Default projects path</S.Option.Title>
          <A.TextInput
            onChange={e => settings.changePath(e.target.value)}
            value={settings.projectsPath}
            type="text"
          />

          <A.Space size={3} />

          <S.Option.Title>Editor cli</S.Option.Title>
          <A.TextInput
            onChange={e => settings.changeEditor(e.target.value)}
            value={settings.editor}
            type="text"
          />

          <A.Space size={3} />

          <A.Horizontal centerV>
            <S.Switch
              {...bindSwitchToMST(
                settings.highlightProjectsWithoutRepo,
                settings.setHighlightProjectsWithoutRepo
              )}
            />
            <S.Option.Title>Highlight projects without a repo</S.Option.Title>
          </A.Horizontal>

          <A.Horizontal centerV>
            <S.Switch {...bindSwitchToMST(settings.showHomeSidebar, settings.setShowHomeSidebar)} />
            <S.Option.Title>Show filters sidebar</S.Option.Title>
          </A.Horizontal>

          <A.Horizontal centerV>
            <S.Switch {...bindSwitchToMST(settings.horizontalLayout, settings.setHorizontalLayout)} />
            <S.Option.Title>Horizontal layout</S.Option.Title>
          </A.Horizontal>

          <A.Horizontal centerV>
            <S.Switch
              checked={settings.indexFiles}
              value={settings.indexFiles}
              onChange={(e, checked) => {
                settings.setIndexFiles(checked);
              }}
            />
            <S.Option.Title>List project files</S.Option.Title>
          </A.Horizontal>
          <S.Option.Description>It might slow down with bigger projects</S.Option.Description>

          <A.Space size={3} />

          <A.Button disabled={!settings.valid} onClick={onSave}>
            Save
          </A.Button>
        </S.Content>
      </S.Settings>
    );
  }
}

export default Settings;
