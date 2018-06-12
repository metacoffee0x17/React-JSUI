import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

@inject('store')
@observer
class Footer extends Component {
  render() {
    const { store } = this.props;
    return (
      <S.Footer>
        Processes running: <span />
      </S.Footer>
    );
  }
}

export default Footer;
