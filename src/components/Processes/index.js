import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';

//emotion
import * as S from './styles';

//components
import Tabs from 'components/Tabs';
import Tab from 'components/Tab';
import Terminal from 'components/Terminal';

//local
import Bar from './components/Bar';
import ProcessTab from './components/ProcessTab';

import { action, observable } from 'mobx';

@observer
class Processes extends Component {
  parentRef = React.createRef();

  @observable minimized = false;
  @observable dragging = false;
  @observable height = 300;
  @observable maxHeight = 600;
  @observable minHeight = 100;

  //later
  @observable startY = 0;
  @observable heightBeforeMinimize = 0;

  //actions
  @action setHeight = height => (this.height = height);

  @action
  toggleMinimize = () => {
    const newValue = !this.minimized;
    this.minimized = newValue;

    if (newValue) {
      this.heightBeforeMinimize = this.height;
      this.height = 'auto';
    } else {
      this.height = this.heightBeforeMinimize;
    }
  };

  onResize = (event, { element, size }) => this.setHeight(size.height);

  @action
  onMouseDown = e => {
    if (!this.minimized) {
      this.dragging = true;
      this.startY = e.clientY;
      this.originalHeight = this.height;
      window.document.body.classList.add('no-select');
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  };

  @action
  onMouseMove = e => {
    if (this.dragging) {
      let distance = e.clientY - this.startY;
      let newHeight = this.originalHeight - distance;
      if (newHeight < this.maxHeight && newHeight >= this.minHeight) {
        this.height = newHeight;
      }
    }
  };

  @action
  onMouseUp = () => {
    this.dragging = false;
    window.document.body.classList.remove('no-select');
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  render() {
    const { processes, overrides } = this.props;
    const { activeForPage, setActive, selectedProcess } = processes;
    const { minimized, toggleMinimize } = overrides || this;
    const { height } = this;

    if (!selectedProcess) {
      return null;
    }

    const rightSide = (
      <Fragment>
        <S.Icon onClick={this.toggleMinimize} />
      </Fragment>
    );

    return (
      <S.Processes ref={this.parentRef} height={height}>
        <Bar
          onMouseDown={this.onMouseDown}
          running={processes.hasRunning}
          title="Terminal"
          onClearOutput={selectedProcess.clearOutput}
          onRestart={selectedProcess.restart}
          onStop={selectedProcess.stop}
          onKill={processes.killActiveProcesses}
          onMinimize={toggleMinimize}
          minimized={minimized}
        />
        <Tabs rightSide={rightSide} onSelect={tab => setActive(tab.value)} value={selectedProcess.id}>
          {activeForPage.map((process, index) => (
            <Tab
              key={process.id}
              value={process.id}
              withPadding={false}
              title={
                <ProcessTab
                  status={process.status}
                  onStop={() => processes.closeProcess(process)}
                  title={process.fullCommand}
                />
              }
            >
              {!minimized && <Terminal key={index} process={process} />}
            </Tab>
          ))}
        </Tabs>
      </S.Processes>
    );
  }
}

export default Processes;
