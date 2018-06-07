import React, { Component } from 'react';
import { observer } from 'mobx-react';

//emotion
import * as S from './styles';

@observer
class Tab extends Component {
  render() {
    const { children, onClick } = this.props;
    return <S.Tab onClick={onClick}>{children}</S.Tab>;
  }
}

export default Tab;
