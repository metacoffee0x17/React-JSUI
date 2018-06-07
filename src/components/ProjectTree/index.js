import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

//styles
import * as S from './styles';

//components
import Contents from './components/Contents';

@inject('store')
@observer
class ProjectTree extends Component {
  render() {
    const { contents, selectedFilePath, store } = this.props;
    return (
      <S.ProjectTree>
        <Contents onSelect={store.setOpenedFile} selectedFilePath={selectedFilePath} contents={contents} />
      </S.ProjectTree>
    );
  }
}

export default ProjectTree;
