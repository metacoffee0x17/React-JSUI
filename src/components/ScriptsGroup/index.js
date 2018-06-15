import React, { Component } from 'react';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

//components
import NpmScript from 'components/NpmScript';

class ScriptsGroup extends Component {
  render() {
    const { group, name } = this.props;
    return (
      <S.ScriptsGroup>
        <S.Title>{name}</S.Title>
        <A.Space size={3} />
        <S.ScriptsList>{group.map(script => <NpmScript script={script} />)}</S.ScriptsList>
      </S.ScriptsGroup>
    );
  }
}

export default ScriptsGroup;
