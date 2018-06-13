import React, { Component } from 'react';

//styles
import * as S from './styles';

//components
import Header from 'components/Header';
import { observer, inject } from 'mobx-react';
@inject('store')
@observer
class WebProjectView extends Component {
  render() {
    const { store } = this.props;
    const { currentProject: project } = store;
    return (
      <S.WebProjectView>
        <Header>{project.name}</Header>
        <webview className={S.Webview} src={project.webUrl} />
      </S.WebProjectView>
    );
  }
}

export default WebProjectView;
