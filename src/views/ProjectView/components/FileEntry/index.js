import React, { Component } from 'react';

//emotion
import * as S from './styles';

class FileEntry extends Component {
  render() {
    const { item } = this.props;
    return (
      <S.FileEntry>
        <S.Name>{item.name}</S.Name>
        {item.id && <S.Path>{`(${item.projectPath})`}</S.Path>}
      </S.FileEntry>
    );
  }
}

export default FileEntry;
