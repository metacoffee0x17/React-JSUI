import React, { Component, Fragment } from 'react';
import { faCheckSquare, faSquare } from '@fortawesome/fontawesome-free-solid';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

//components
import ToggleIcon from 'components/ToggleIcon';

class CheckMultipleList extends Component {
  click = item => {
    const { onClick } = this.props;
    onClick && onClick(item);
  };

  check = item => {
    const { onCheck } = this.props;
    onCheck && onCheck(item);
  };

  render() {
    const { list } = this.props;

    return (
      <S.CheckMultipleList>
        {list.map((item, index) => {
          return (
            <S.CheckMultipleListItem key={item.value} onClick={() => this.check(item)}>
              <A.Horizontal centerV>
                <ToggleIcon
                  inactive={!item.checked}
                  active={item.checked}
                  onIcon={faCheckSquare}
                  offIcon={faSquare}
                />
                <A.Space size={1.5} />
                <S.Name>{item.label}</S.Name>
              </A.Horizontal>
            </S.CheckMultipleListItem>
          );
        })}
      </S.CheckMultipleList>
    );
  }
}

export default CheckMultipleList;
