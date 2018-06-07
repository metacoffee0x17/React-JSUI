import React, { Component } from 'react';
import { observer } from 'mobx-react';

//emotion
import * as S from './styles';

import { reaction } from 'mobx';

@observer
class Terminal extends Component {
  outputRef = React.createRef();

  componentDidMount() {
    this.disposeReaction = reaction(
      () => this.props.process.output || this.props.process.running,
      () => {
        if (this.outputRef.current) {
          this.outputRef.current.scrollTop = 999999;
        }
      }
    );
  }

  componentWillUnmount() {
    this.disposeReaction();
  }

  render() {
    const { process } = this.props;
    return <S.Terminal innerRef={this.outputRef}>{process.output}</S.Terminal>;
  }
}

export default Terminal;
