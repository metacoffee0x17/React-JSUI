import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Tooltip } from 'react-tippy';
import routes from 'config/routes';
import { faPlay } from '@fortawesome/fontawesome-free-solid';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

//components
import Header from 'components/Header';
import IconWithTip from 'components/IconWithTip';

@inject('store')
@observer
class GroupView extends Component {
  render() {
    const { store } = this.props;
    const { currentGroup: group, router } = store;

    return (
      <S.GroupView>
        <Header>
          <A.Horizontal spaceAll={15}>
            <S.Name onClick={() => store.renameGroup(group.name, group.id)}>{group.name}</S.Name>
            <IconWithTip
              onClick={() => store.startAllInCurrentGroup()}
              tip="Start all projects in group"
              icon={faPlay}
            />
          </A.Horizontal>
        </Header>

        <A.Padding>
          {group.projects && (
            <A.Horizontal wrap>
              {group.projects.map(project => (
                <S.Project>
                  <A.Link onClick={() => router.openPage(routes.project, { id: project.id })}>
                    {project.name}
                  </A.Link>
                  <A.Space size={3} />
                  <A.Horizontal spaceBottom wrap spaceAll={15}>
                    {project.packageJson &&
                      project.packageJson.scripts &&
                      Object.entries(project.packageJson.scripts).map(([name, script]) => (
                        <Tooltip title={script}>
                          <S.Button onClick={() => project.runScript(name)}>{name}</S.Button>
                        </Tooltip>
                      ))}
                  </A.Horizontal>
                </S.Project>
              ))}
            </A.Horizontal>
          )}
        </A.Padding>
      </S.GroupView>
    );
  }
}

export default GroupView;
