import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

//icons
import { faObjectGroup, faPlus, faCogs } from '@fortawesome/fontawesome-free-solid';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

//components
import Group from 'components/Group';
import Header from 'components/Header';
import IconWithTip from 'components/IconWithTip';
import Processes from 'components/Processes';
import keydown from 'react-keydown';

@inject('store')
@observer
class Home extends Component {
  @keydown(['cmd+o'])
  openFolder() {
    const { store } = this.props;
    store.openFolder();
  }

  @keydown(['cmd+g'])
  createGroup() {
    const { store } = this.props;
    store.createGroup();
  }

  render() {
    const { store } = this.props;
    const { home } = store;
    const { groupsWithProjects, hasProjects, collapsed } = store;

    return (
      <S.Home>
        <Header>
          {hasProjects && (
            <Fragment>
              <IconWithTip onClick={() => store.openFolder()} icon={faPlus} tip="Import project" />
              <IconWithTip onClick={store.createGroup} icon={faObjectGroup} tip="Create a group" />
              <IconWithTip onClick={store.generateDialogOpen.setTrue} icon={faCogs} tip="Generate an app" />
            </Fragment>
          )}
        </Header>

        <A.Mid>
          {!hasProjects && (
            <S.Empty>
              <S.Title>You don't have any projects. Add your first one?</S.Title>
              <A.Horizontal spaceAll={15}>
                <A.Button onClick={store.openFolder}> Import a project </A.Button>
                <A.Button onClick={store.generateDialogOpen.setTrue}> Generate a project </A.Button>
              </A.Horizontal>
            </S.Empty>
          )}

          {groupsWithProjects && (
            <S.GroupList>
              {groupsWithProjects.map(group => (
                <Group
                  onClick={() => collapsed && store.pickGroupForProject(group)}
                  collapsed={collapsed}
                  group={group}
                  key={group.id}
                />
              ))}
            </S.GroupList>
          )}
        </A.Mid>

        {store.processes.hasProcesses && <Processes processes={store.processes} />}
      </S.Home>
    );
  }
}

export default Home;
