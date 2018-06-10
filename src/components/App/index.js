import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ipcc from 'ipcc/renderer';

//styles
import * as S from './styles';

//components
import Home from 'views/Home';
import Dialogs from 'components/Dialogs';
import { executeShortcut } from 'config/shortcuts';

@inject('store')
@observer
class App extends Component {
  componentDidMount() {
    ipcc.answerMain('execute-shortcut', shortcut => executeShortcut(shortcut, this.props.store));
  }

  render() {
    const { store } = this.props;
    const { router } = store;
    const showHomePage = !router.page || router.page === 'home';

    return (
      <S.App>
        {showHomePage ? <Home /> : router.extra ? router.extra.component : null}
        <Dialogs />
      </S.App>
    );
  }
}

export default App;
