import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { List, AutoSizer, WindowScroller } from 'react-virtualized';
//emotion
import * as S from './styles';

import { reaction } from 'mobx';

@observer
class Terminal extends Component {
  outputRef = React.createRef();
  render() {
    const { process } = this.props;
    let chunkedOutput = process.chunkedOutput.toJSON();
    return (
      <S.Terminal>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <List
                ref={ref => (this.outputRef = ref)}
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
