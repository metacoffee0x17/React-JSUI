//region: imports
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import keydown from 'react-keydown';
import { remote } from 'electron';

//icons
import { faCode, faFolder, faPlug, faCogs } from '@fortawesome/fontawesome-free-solid/index';

//utils
import get from 'lodash/get';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import { Horizontal, Vertical } from 'styles/flex-components';
import { spaceUnit } from 'styles/shared-components';

//components
import DependenciesList from 'components/DependenciesList';
import Processes from 'components/Processes';
import ProjectTree from 'components/ProjectTree';
import PopupSelector from 'components/PopupSelector';
import Header from 'components/Header';
import IconWithTip from 'components/IconWithTip';
import Dialog from 'components/Dialog';
import ListOfBlocks from 'components/ListOfBlocks';
import InstallDependencyForm from 'components/InstallDependencyForm';

//external components
import { Tooltip } from 'react-tippy';

//local components
import FileEntry from './components/FileEntry';

import Boolean from 'models/Boolean';
import String from 'models/String';

const plugins = remote.require('./plugins/index');

//endregion
@inject('store')
@observer
class ProjectView extends Component {
  pluginDialogOpen = Boolean.create();
  generatorsDialogOpen = Boolean.create();
  searchOpened = Boolean.create();
  dependenciesDialogOpen = String.create();

  @keydown(['cmd+shift+n'])
  submit() {
    this.searchOpened.setTrue();
  }

  componentDidMount() {
    this.clearReaction = reaction(
      () => this.props.store.currentProject,
      nextProject => {
        nextProject && nextProject.readContents();
      },
      {
        fireImmediately: true
      }
    );
  }

  componentWillUnmount() {
    this.clearReaction();
  }

  render() {
    const { store, overrides } = this.props;
    const { searchOpened } = overrides || this;
    const { currentProject: project } = store;
    const hasScripts = project.packageJson && project.packageJson.scripts;

    const dependenciesListProps = {
      onDelete: project.deleteDependency,
      onUpgrade: project.upgradeDependency,
      onMove: project.moveDependency
    };

    const hasProcesses = project.processes.list.length > 0;
    const spaceAll = spaceUnit * 3;

    const mappedItems = project.allItems.map(({ path, ...rest }) => ({
      id: path,
      ...rest
    }));

    let shouldOpenSearch = searchOpened.value && mappedItems && mappedItems.length > 0;
    let hasGenerators = project.generatorList && project.generatorList.length > 0;

    return <S.ProjectView>
        <Header renderRight={<A.Horizontal spaceAll={15}>
              {hasGenerators && <IconWithTip tip="Generate with plop" icon={faCogs} onClick={this.generatorsDialogOpen.setTrue} />}
              <IconWithTip tip="Apply plugin" icon={faPlug} onClick={this.pluginDialogOpen.setTrue} />
              <IconWithTip tip="Open in Finder" icon={faFolder} onClick={project.openDir} />
              <IconWithTip tip="Edit code" icon={faCode} onClick={project.edit} />

              {/*          <IconWithTip
                tip="Reinstall dependencies"
                icon={faRecycle}
                onClick={project.reinstallDependencies}
              />
              <IconWithTip tip="Delete dependencies" icon={faTrash} onClick={project.deleteDependencies} />
              <IconWithTip tip="Install dependencies" icon={faPlug} onClick={project.installDependencies} />*/}
            </A.Horizontal>}>
          <A.Horizontal spaceAll={8}>
            <S.Title>
              {project.name} {project.packageJson && project.packageJson.version}
            </S.Title>
            {project.origin && <Tooltip title={project.origin} position="bottom">
                <A.SmallButton onClick={project.goToOrigin}>git</A.SmallButton>
              </Tooltip>}
          </A.Horizontal>
        </Header>

        <A.Horizontal flex={1}>
          {project.contents && <ProjectTree contents={project.contents} />}
          <S.Mid hasProcesses={hasProcesses}>
            <S.Right>
              {project.ready && <React.Fragment>
                  {hasScripts && <React.Fragment>
                      <S.Section.Title> Scripts </S.Section.Title>
                      <A.Space size={3} />
                      <Horizontal wrap spaceBottom spaceAll={spaceAll}>
                        {Object.entries(project.packageJson.scripts).map(([name, script]) => (
                          <Tooltip title={script}>
                            <A.Button onClick={() => project.runScript(name)}>{name}</A.Button>
                          </Tooltip>
                        ))}
                      </Horizontal>
                    </React.Fragment>}

                  {/* Dependencies */}
                  <Horizontal spaceAll={10} flex={1}>
                    {/* Dependencies list */}
                    <Vertical>
                      <Horizontal centerV css={{ minHeight: 30 }} wrap spaceAll={spaceAll}>
                        <S.Section.Title> Dependencies </S.Section.Title>
                        <Tooltip title="Add a dependency">
                          <A.SmallButton onClick={() => this.dependenciesDialogOpen.setValue('open')}>
                            add
                          </A.SmallButton>
                        </Tooltip>
                      </Horizontal>
                      {get(project, 'packageJson.dependencies') && (
                        <DependenciesList 
                          {...dependenciesListProps} 
                          list={project.packageJson.dependencies}
                          onDependencyClicked={(packageName, packageVersion) => {
                              project.goToDependencyPage(packageName, packageVersion);
                          }} 
                        />)
                      }
                    </Vertical>

                    {/* Dev dependencies list */}

                    <Vertical>
                      <Horizontal centerV css={{ minHeight: 30 }} wrap spaceAll={spaceAll}>
                        <S.Section.Title> Dev dependencies </S.Section.Title>
                        <Tooltip title="Add a dev dependency">
                          <A.SmallButton onClick={() => this.dependenciesDialogOpen.setValue('dev')}>
                            add
                          </A.SmallButton>
                        </Tooltip>
                      </Horizontal>
                      {get(project, 'packageJson.devDependencies') && <DependenciesList {...dependenciesListProps} isDev={true} list={project.packageJson.devDependencies} />}
                    </Vertical>
                  </Horizontal>
                </React.Fragment>}
            </S.Right>
          </S.Mid>

          {shouldOpenSearch && <PopupSelector closeOnChoose={true} renderItem={item => <FileEntry item={item} />} showSearch={true} items={mappedItems} onChoose={entry => store.setOpenedFile(entry.id)} onEsc={this.searchOpened.setFalse} />}

          {hasProcesses && <Processes processes={project.processes} />}

          {this.pluginDialogOpen.value === true && <Dialog onClose={this.pluginDialogOpen.setFalse} onEsc={this.pluginDialogOpen.setFalse}>
              <A.Padding>
                <ListOfBlocks list={plugins} onPick={plugin => {
                    project.applyPlugin(plugin);
                    this.pluginDialogOpen.setFalse();
                  }} />
              </A.Padding>
            </Dialog>}

          {this.generatorsDialogOpen.value === true && <Dialog onClose={this.generatorsDialogOpen.setFalse} onEsc={this.generatorsDialogOpen.setFalse}>
              <A.Padding>
                <ListOfBlocks list={project.generatorList} onPick={generator => {
                    project.generate(generator.name);
                    this.generatorsDialogOpen.setFalse();
                  }} />
              </A.Padding>
            </Dialog>}

          {this.dependenciesDialogOpen.hasValue && <Dialog onClose={this.dependenciesDialogOpen.clear}>
              <InstallDependencyForm isDev={this.dependenciesDialogOpen.value === 'dev'} onCancel={this.dependenciesDialogOpen.clear} onSubmit={formValues => {
                  project.installDependency(formValues);
                  this.dependenciesDialogOpen.clear();
                }} />
            </Dialog>}
        </A.Horizontal>
      </S.ProjectView>;
  }
}

export default ProjectView;