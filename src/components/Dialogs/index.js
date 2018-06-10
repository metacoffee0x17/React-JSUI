import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import generators from 'generators';
import routes from 'config/routes';
import { actionsList } from 'models/actions';
import map from 'lodash/map';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import { Horizontal } from 'styles/flex-components';

//components
import PopupSelector from 'components/PopupSelector';
import Dialog from 'components/Dialog';
import CssToJsConverter from 'components/CssToJsConverter';
import BabelRepl from 'components/BabelRepl';
import Settings from 'views/Settings';
import ListOfBlocks from 'components/ListOfBlocks';
import CliGenerator from 'components/CliGenerator';
import ImportWorkspace from 'components/ImportWorkspace';

@inject('store')
@observer
class Dialogs extends Component {
  render() {
    const { store } = this.props;
    const { projects, settingsOpened } = store;
    const { searchOpened, actions, cssConverterDialogOpen, babelReplDialogOpen } = store;

    const mappedItems = projects.map(({ name, id, path }) => ({ name, id, path }));
    const mappedActions = map(actionsList, ({ name, command }) => ({ name, command, id: name }));

    return (
      <S.Dialogs>
        {actions.opened.value === true && (
          <PopupSelector
            key="actions"
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
            key="search-projects"
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
          <Dialog key="settings" onClose={settingsOpened.setFalse}>
            <Settings onSave={settingsOpened.setFalse} />
          </Dialog>
        )}

        {store.openedFile && (
          <Dialog key="opened-file" onClose={store.closeFile} onEsc={store.closeFile}>
            <S.Editor
              value={store.openedFile.content}
              options={{ mode: 'javascript', theme: 'material', lineNumbers: true }}
            />
          </Dialog>
        )}

        {cssConverterDialogOpen.value === true && (
          <Dialog key="css-to-js" onClose={cssConverterDialogOpen.setFalse}>
            <CssToJsConverter onDone={cssConverterDialogOpen.setFalse} />
          </Dialog>
        )}

        {babelReplDialogOpen.value === true && (
          <Dialog
            key="babel-repl"
            styles={{ content: { maxWidth: 900, width: '80%' } }}
            onClose={babelReplDialogOpen.setFalse}
          >
            <BabelRepl />
          </Dialog>
        )}

        {store.activeGenerator !== null &&
          store.activeGenerator !== undefined && (
            <Dialog key="active-generator" onClose={store.clearActiveGenerator}>
              <CliGenerator
                onCancel={store.clearActiveGenerator}
                initialValues={store.activeGenerator.initialValues}
                onSubmit={store.runCliGenerator}
                generator={store.activeGenerator}
              />
            </Dialog>
          )}

        {store.generateDialogOpen.value === true && (
          <Dialog key="generate-dialog" onClose={store.generateDialogOpen.setFalse}>
            <A.DialogContent>
              <h3> Generate a project </h3>
              <ListOfBlocks onPick={store.setActiveGenerator} list={generators} />
            </A.DialogContent>
          </Dialog>
        )}

        {!!store.importingWorkspace && (
          <Dialog key="import-workspace" onClose={store.generateDialogOpen.setFalse}>
            <ImportWorkspace
              onCancel={store.cancelImportingWorkspace}
              onSubmit={store.importWorkspace}
              workspace={store.importingWorkspace}
            />
          </Dialog>
        )}
      </S.Dialogs>
    );
  }
}

export default Dialogs;
