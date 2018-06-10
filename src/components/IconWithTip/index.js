import React, { Component } from 'react';
import ConditionalWrap from 'conditional-wrap';

//emotion
import * as S from './styles';

//components
import { Tooltip } from 'react-tippy';

class IconWithTip extends Component {
  static defaultProps = {
    position: 'bottom'
  };

  render() {
    const { icon, delay = 300, tip, position, ...rest } = this.props;

    return (
      <ConditionalWrap
        condition={tip}
        wrap={children => (
          <Tooltip delay={delay} title={tip} position={position}>
            {children}
          </Tooltip>
        )}
      >
        <S.Icon {...rest} icon={icon} />
      </ConditionalWrap>
    );
  }
}

export default IconWithTip;
