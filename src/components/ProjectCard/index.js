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
  faGlobe,
  faTrash,
  faArrowsAlt
} from '@fortawesome/fontawesome-free-solid';

import { PROJECT_TAGS } from 'config/enums';

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
    router.openPage(project.isWebBased ? routes.webProject : routes.project, { id: project.id });
  };

  render() {
    const { project, store, showMove, horizontal } = this.props;
    const { settings } = store;
    const { type, ready, isWebBased } = project;
    const hasProjectType = type && type !== PROJECT_TAGS.UNKNOWN;
    const markRed = settings.highlightProjectsWithoutRepo && !project.origin && !isWebBased;

    return (
      <S.ProjectCard horizontal={horizontal} markRed={markRed}>
        <Vertical>
          <S.Name onClick={this.onClick}>{project.name}</S.Name>
          <Horizontal spaceAll={5}>{hasProjectType && <S.Tag> {project.type} </S.Tag>}</Horizontal>
        </Vertical>

        <Horizontal css={{ marginTop: 10 }} spaceAll={15}>
          {!isWebBased && <A.ActionIcon tip="Open in Finder" icon={faFolder} onClick={project.openDir} />}
          {!isWebBased && <A.ActionIcon tip="Edit" icon={faCode} onClick={project.edit} />}

          {isWebBased && (
            <A.ActionIcon tip={`Open ${project.webUrl}`} icon={faGlobe} onClick={project.openWebUrl} />
          )}

          {ready && (
            <React.Fragment>
              {!isWebBased && <A.ActionIcon tip="package.json" icon={faEye} onClick={project.previewFile} />}
              <A.ActionIcon
                tip="Rename"
                icon={faEdit}
                onClick={() => store.renameProject(project.id, project.name)}
              />
              {!isWebBased &&
                project.startScriptName && (
                  <A.ActionIcon tip="Start" icon={faPlay} onClick={project.navigateThenStart} />
                )}
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
