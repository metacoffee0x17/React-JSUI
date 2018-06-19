import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

//styles
import * as S from './styles';

//components
import NpmScript from 'components/NpmScript';

@inject('store')
@observer
class ScriptsList extends Component {
  render() {
    const { list, store } = this.props;
    const { settings } = store;

    return (
      <S.ScriptsList vertical={settings.verticalScriptsLayout}>
        {list.map(script => <NpmScript script={script} />)}
      </S.ScriptsList>
    );
  }
}

export default ScriptsList;
