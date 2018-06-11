import React, { Component } from 'react';
import { observer } from 'mobx-react';

//glamorous
import * as S from './styles';

@observer
class MiniTabs extends Component {
  static defaultProps = {
    allowNull: false
  };

  select = item => {
    const { onSelect } = this.props;
    onSelect && onSelect(item);
  };

  render() {
    const { list = [], small, className } = this.props;

    return (
      <S.MiniTabs small={small} className={className}>
        {list.map(item => {
          return (
            <S.Tab small={small} key={item.value} onClick={() => this.select(item)} active={item.selected}>
              {item.label}
            </S.Tab>
          );
        })}
      </S.MiniTabs>
    );
  }
}

export default MiniTabs;
