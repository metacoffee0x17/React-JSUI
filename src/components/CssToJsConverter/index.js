import React, { Component } from 'react';
import { bindStateToField } from 'utils/bind-utils';
import cssToJs from 'utils/css-to-js';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import { BUTTONS } from 'config/enums';

class CssToJsConverter extends Component {
  state = {
    from: ''
  };

  onChange = e => this.setState({ from: e.target.value });

  render() {
    const { onDone } = this.props;
    const converted = cssToJs(this.state.from);

    return (
      <S.CssToJsConverter>
        <h1> CSS to css-in-js</h1>
        <A.TopFlex>
          <A.Horizontal flex={1} centerV spaceAll={15}>
            <S.Textarea placeholder="Type some CSS here" value={this.state.from} onChange={this.onChange} />
            <S.Textarea
              value={converted}
              disabled={true}
              placeholder="Converted css-in-js will appear here"
            />
          </A.Horizontal>
        </A.TopFlex>
        <A.Space size={3} />
        <A.Horizontal justifyEnd>
          <A.Button onClick={onDone} type={BUTTONS.PRIMARY}>
            Done
          </A.Button>
        </A.Horizontal>
      </S.CssToJsConverter>
    );
  }
}

export default CssToJsConverter;
