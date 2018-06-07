import React, { Component } from 'react';

//emotion
import * as S from './styles';

class TabStrip extends Component {
  render() {
    const { tabs, onSelect } = this.props;

    return (
      <S.TabStrip>
        {tabs.map(tab => (
          <S.Tab key={tab.title} withPadding={tab.withPadding} selected={tab.selected} onClick={() => onSelect(tab)}>
            {tab.title}
          </S.Tab>
        ))}
      </S.TabStrip>
    );
  }
}

export default TabStrip;
