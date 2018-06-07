import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import routes from 'config/routes';

//IconWithTips
import {
  faHome,
  faBomb,
  faObjectGroup,
  faFolderOpen,
  faCogs,
  faCog
} from '@fortawesome/fontawesome-free-solid';

//styles
import * as S from './styles';
import { Horizontal } from 'styles/flex-components';

//components
import IconWithTip from 'components/IconWithTip';

@inject('store')
@observer
class Header extends Component {
  render() {
    const { store, children, renderRight } = this.props;
    const { router } = store;
    const showHomeIcon = router.page !== routes.home.id;

    return (
      <S.Header>
        <IconWithTip
          css={{ opacity: showHomeIcon ? 1 : 0 }}
          onClick={() => router.openPage(routes.home)}
          icon={faHome}
        />

        <Horizontal spaceAll={20}>
          {children}
        </Horizontal>

        {renderRight ? renderRight: <div/>}
      </S.Header>
    );
  }
}

export default Header;
