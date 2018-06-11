import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import routes from 'config/routes';
import Swal from 'sweetalert2';

//styles
import { Vertical, Horizontal } from 'styles/flex-components';

//components
import * as S from './styles';
import * as A from 'styles/shared-components';

import {
  faFolder,
  faExternalLinkAlt,
  faPlay,
  faEdit,
  faCode,
  faEye,
  faRecycle,
  faTrash,
  faPlug,
  faArrowsAlt
} from '@fortawesome/fontawesome-free-solid';

import { PROJECT_TYPES } from 'config/enums';

@inject('store')
@observer
class Project extends Component {
  onClick = () => {
    const { project, store } = this.props;
    const { router } = store;
    if (project.ready === false) {
      return Swal({
        title: 'The project is not ready yet, please wait.',
        text: 'The generator is still working.',
        type: 'warning'
      });
    }
    router.openPage(routes.project, { id: project.id });
  };

  render() {
    const { project, store, showMove } = this.props;
    const { settings } = store;
    const { type, ready } = project;
    const hasProjectType = type && type !== PROJECT_TYPES.UNKNOWN;

    return (
      <S.ProjectCard markRed={settings.highlightProjectsWithoutRepo && !project.origin}>
        <Vertical>
          <S.Name onClick={this.onClick}>{project.name}</S.Name>
          <Horizontal spaceAll={5}>{hasProjectType && <S.Tag> {project.type} </S.Tag>}</Horizontal>
        </Vertical>

        <Horizontal css={{ marginTop: 10 }} spaceAll={15}>
          <A.ActionIcon tip="Open in Finder" icon={faFolder} onClick={project.openDir} />
          <A.ActionIcon tip="Edit" icon={faCode} onClick={project.edit} />

          {ready && (
            <React.Fragment>
              <A.ActionIcon tip="package.json" icon={faEye} onClick={project.previewFile} />
              <A.ActionIcon
                tip="Rename"
                icon={faEdit}
                onClick={() => store.renameProject(project.id, project.name)}
              />
              {project.startScriptName && <A.ActionIcon tip="Start" icon={faPlay} onClick={project.start} />}
              {/* <A.ActionIcon
                tip="Reinstall dependencies"
                icon={faRecycle}
                onClick={project.reinstallDependencies}
              />
              <A.ActionIcon tip="Delete dependencies" icon={faTrash} onClick={project.deleteDependencies} />
              <A.ActionIcon tip="Install dependencies" icon={faPlug} onClick={project.installDependencies} />*/}
              {project.origin && (
                <A.ActionIcon tip={project.origin} icon={faExternalLinkAlt} onClick={project.goToOrigin} />
              )}
              <A.ActionIcon
                icon={faTrash}
                color="#ff9590"
                tip="Delete"
                onClick={() => store.removeProject(project.id)}
              />
            </React.Fragment>
          )}

          {showMove && (
            <A.ActionIcon
              tip="Move to group"
              icon={faArrowsAlt}
              onClick={() => store.addProjectToGroup(project)}
            />
          )}
        </Horizontal>
      </S.ProjectCard>
    );
  }
}

export default Project;
