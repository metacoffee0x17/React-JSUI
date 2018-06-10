import React, { Component } from 'react';
import truncate from 'lodash/truncate';
import { faCodeBranch } from '@fortawesome/fontawesome-free-solid';

import IconWithTip from 'components/IconWithTip';

import * as S from './styles';

class GitBranch extends Component {
  render() {
    const { branchName } = this.props;

    return(
      <S.Branch>
        <S.Icon icon={faCodeBranch} />
        {truncate(branchName, {length: 48, separator: '...'})}
      </S.Branch>
    )
  }
}

export default GitBranch;
