import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ipcc from 'ipcc/renderer';

//styles
import * as S from './styles';
import { Horizontal } from 'styles/flex-components';

//components
import PopupSelector from 'components/PopupSelector';
import Dialog from 'components/Dialog';
import Home from 'views/Home';

import keydown from 'react-keydown';
import routes from 'config/routes';
import Boolean from 'models/Boolean';
import Settings from 'views/Settings';

@inject('store')
@observer
class App extends Component {
  searchOpened = Boolean.create();

  @keydown(['cmd+shift+p'])
  submit() {
    if (this.props.store.hasProjects) {
      this.searchOpened.setTrue();
    }
  }

  @keydown(['cmd+shift+h'])
  goHome() {
    this.props.store.router.openPage(routes.home);
  }

  componentDidMount() {
    ipcc.answerMain('open-settings', () => {
      this.props.store.settingsOpened.setTrue();
    });
  }

  render() {
    const { store, overrides } = this.props;
    const { projects, router, settingsOpened } = store;
    const { searchOpened } = overrides || this;

    const mappedItems = projects.map(({ name, id, path }) => ({ name, id, path }));
    const showHomePage = !router.page || router.page === 'home';

    return (
      <S.App>
        {showHomePage ? <Home /> : router.extra ? router.extra.component : null}

        {searchOpened.value === true && (
          <PopupSelector
            renderItem={({ name, path }) => (
              <Horizontal centerV spaceBetween flex={1}>
                <div>{name}</div>
                <div>{path}</div>
              </Horizontal>
            )}
            showSearch={true}
            closeOnChoose={true}
            items={mappedItems}
            onChoose={project => store.router.openPage(routes.project, { id: project.id })}
            onEsc={this.searchOpened.setFalse}
          />
        )}

        {settingsOpened.value === true && (
          <Dialog onClose={settingsOpened.setFalse}>
            <Settings onSave={settingsOpened.setFalse} />
          </Dialog>
        )}

        {store.openedFile && (
          <Dialog onClose={store.closeFile} onEsc={store.closeFile}>
            <S.Editor
              value={store.openedFile.content}
              options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true
              }}
            />
          </Dialog>
        )}
      </S.App>
    );
  }
}

export default App;
