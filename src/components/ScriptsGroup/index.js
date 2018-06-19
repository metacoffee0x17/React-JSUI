import React, { Component } from 'react';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

//components
import ScriptsList from 'components/ScriptsManager/components/ScriptsList';

class ScriptsGroup extends Component {
  render() {
    const { group, name } = this.props;
    return (
      <S.ScriptsGroup>
        <S.Title>{name}</S.Title>
        <A.Space size={3} />
        <ScriptsList list={group} />
      </S.ScriptsGroup>
    );
  }
}

export default ScriptsGroup;
