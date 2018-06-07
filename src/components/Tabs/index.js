import React, { Component } from 'react';
import { observer } from 'mobx-react';

//emotion
import * as S from './styles';

//components
import TabStrip from 'components/TabStrip';

@observer
class Tabs extends Component {
  render() {
    const { children, rightSide, value, onSelect } = this.props;
    let selectedTab;

    React.Children.forEach(children, tab => {
      if (value === tab.props.value) {
        selectedTab = tab;
      }
    });

    const mappedTabs = React.Children.map(children, tab => ({
      selected: tab.props.value === value,
      ...tab.props
    }));

    return (
      <S.Tabs>
        <S.Bar>
          <TabStrip onSelect={onSelect} tabs={mappedTabs} />
          <S.RightSide>
            <S.RightSide>{rightSide}</S.RightSide>
          </S.RightSide>
        </S.Bar>
        {selectedTab && selectedTab.props.children}
      </S.Tabs>
    );
  }
}

export default Tabs;
