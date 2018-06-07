import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

//styles
import * as S from './styles';
import { Horizontal } from 'styles/flex-components';

//components
import PopupSelector from 'components/PopupSelector';
import Dialog from 'components/Dialog';
import Home from 'views/Home';

import { action, observable } from 'mobx';
import keydown from 'react-keydown';
import routes from 'config/routes';

@inject('store')
@observer
class App extends Component {
  @observable searchOpened = false;
  @action setSearchOpen = v => (this.searchOpened = v);

  @keydown(['cmd+shift+p'])
  submit() {
    if (this.props.store.hasProjects) {
      this.setSearchOpen(true);
    }
  }

  @keydown(['cmd+shift+h'])
  goHome() {
    this.props.store.router.openPage(routes.home);
  }

  render() {
    const { store, overrides } = this.props;
    const { projects, router } = store;
    const { searchOpened } = overrides || this;
    const mappedItems = projects.map(({ name, id, path }) => ({ name, id, path }));
    const showHomePage = !router.page || router.page === 'home';

    return (
      <S.App>
        {showHomePage ? <Home /> : router.extra ? router.extra.component : null}

        {searchOpened && (
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
            onEsc={() => this.setSearchOpen(false)}
          />
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
