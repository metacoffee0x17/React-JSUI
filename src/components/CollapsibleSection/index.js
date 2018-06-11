import React, { Component } from 'react';
import { faMinusSquare, faPlusSquare } from '@fortawesome/fontawesome-free-solid';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

import ToggleIcon from 'components/ToggleIcon';

class CollapsibleSection extends Component {
  state = {
    show: this.props.initialShow
  };

  toggleSection = () => {
    this.setState(({ show }) => ({ show: !show }));
  };

  render() {
    const { children, title, space } = this.props;
    return (
      <S.CollapsibleSection>
        <A.Horizontal spaceAll={10}>
          <ToggleIcon
            onClick={this.toggleSection}
            onIcon={faMinusSquare}
            offIcon={faPlusSquare}
            active={this.state.show}
          />
          {title}
        </A.Horizontal>
        {space && <A.Space size={space} />}
        {this.state.show && children}
      </S.CollapsibleSection>
    );
  }
}

export default CollapsibleSection;
