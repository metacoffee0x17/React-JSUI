import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

//components
import ScriptCommand from 'components/ScriptCommand';

@inject('scripts')
@observer
class ScriptDefinition extends Component {

  render() {
    const { definition, useLabels } = this.props;
    const splitted = definition.split('&&');

    return (
      <S.ScriptDefinition>
        {splitted.map(s => <ScriptCommand useLabels={useLabels} command={s} />)}
      </S.ScriptDefinition>
    );
  }
}

export default ScriptDefinition;
