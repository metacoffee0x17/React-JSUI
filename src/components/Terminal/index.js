import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { List, AutoSizer } from 'react-virtualized';
//emotion
import * as S from './styles';

@observer
class Terminal extends Component {
  render() {
    const { process } = this.props;
    const chunkedOutput = process.chunkedOutput.toJSON();
    return (
      <S.Terminal>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <List
                height={height}
                rowCount={chunkedOutput.length}
                rowHeight={30}
                rowRenderer={({ index, style }) => <div style={style}>{chunkedOutput[index]}</div>}
                scrollToIndex={chunkedOutput.length - 1}
                width={width}
              />
            );
          }}
        </AutoSizer>
      </S.Terminal>
    );
  }
}

export default Terminal;
