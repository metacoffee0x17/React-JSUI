import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ipcc from 'ipcc/renderer';
import keydown from 'react-keydown';
import routes from 'config/routes';
import { actionsList } from 'models/actions';
import map from 'lodash/map';
import generators from 'generators';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

import { Horizontal } from 'styles/flex-components';

//components
import PopupSelector from 'components/PopupSelector';
import Dialog from 'components/Dialog';
import Home from 'views/Home';
import CssToJsConverter from 'components/CssToJsConverter';
import BabelRepl from 'components/BabelRepl';
import Settings from 'views/Settings';
import ListOfBlocks from 'components/ListOfBlocks';
import CliGenerator from 'components/CliGenerator';

@inject('store')
@observer
class App extends Component {
  @keydown(['cmd+shift+p'])
  submit() {
    const {
      store: { hasProjects, searchOpened }
    } = this.props;
    if (hasProjects) {
      searchOpened.setTrue();
    }
  }

  @keydown(['cmd+shift+h'])
  goHome() {
    this.props.store.router.openPage(routes.home);
  }

  @keydown(['cmd+shift+a'])
  openActions() {
    this.props.store.actions.opened.setTrue();
  }

  componentDidMount() {
    ipcc.answerMain('open-settings', () => {
      this.props.store.settingsOpened.setTrue();
    });
  }

  render() {
    const { store } = this.props;
    const { projects, router, settingsOpened } = store;
    const { searchOpened, actions, cssConverterDialogOpen, babelReplDialogOpen } = store;

    const mappedItems = projects.map(({ name, id, path }) => ({ name, id, path }));
    const mappedActions = map(actionsList, ({ name, command }) => ({ name, command, id: name }));
    const showHomePage = !router.page || router.page === 'home';

    return (
      <S.App>
        {showHomePage ? <Home /> : router.extra ? router.extra.component : null}

        {actions.opened.value === true && (
          <PopupSelector
            renderItem={({ name }) => (
              <Horizontal centerV spaceBetween flex={1}>
                <div>{name}</div>
              </Horizontal>
            )}
            showSearch={true}
            closeOnChoose={true}
            items={mappedActions}
            onChoose={action => actions.runAction(action.command)}
            onEsc={actions.opened.setFalse}
          />
        )}

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
            onEsc={searchOpened.setFalse}
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
              options={{ mode: 'javascript', theme: 'material', lineNumbers: true }}
            />
          </Dialog>
        )}

        {cssConverterDialogOpen.value === true && (
          <Dialog onClose={cssConverterDialogOpen.setFalse}>
            <CssToJsConverter onDone={cssConverterDialogOpen.setFalse} />
          </Dialog>
        )}

        {babelReplDialogOpen.value === true && (
          <Dialog
            styles={{ content: { maxWidth: 900, width: '80%' } }}
            onClose={babelReplDialogOpen.setFalse}
          >
            <BabelRepl />
          </Dialog>
        )}

        {store.activeGenerator && (
          <Dialog onClose={store.clearActiveGenerator}>
            <CliGenerator
              onCancel={store.clearActiveGenerator}
              initialValues={store.activeGenerator.initialValues}
              onSubmit={store.runCliGenerator}
              generator={store.activeGenerator}
            />
          </Dialog>
        )}

        {store.generateDialogOpen.value === true && (
          <Dialog onClose={store.generateDialogOpen.setFalse}>
            <A.DialogContent>
              <h3> Generate a project </h3>
              <ListOfBlocks onPick={store.setActiveGenerator} list={generators} />
            </A.DialogContent>
          </Dialog>
        )}
      </S.App>
    );
  }
}

export default App;
