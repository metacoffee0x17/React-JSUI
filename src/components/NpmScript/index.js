import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { faCaretDown, faCaretUp } from '@fortawesome/fontawesome-free-solid';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

//components
import ScriptDefinition from 'components/ScriptDefinition';
import Boolean from 'models/Boolean';

@observer
@inject('scripts')
class NpmScript extends Component {
  expanded = Boolean.create();

  hover = () => {
    const {
      scripts,
      script: { name }
    } = this.props;
    console.log('scripts are', scripts);
    scripts.highlightedCommand.setValue(name);
  };

  render() {
    const { scripts, script } = this.props;
    const { name, description, definition } = script;

    return (
      <S.NpmScript onMouseEnter={this.hover} onMouseLeave={scripts.clear} key={name}>
        <A.Horizontal spaceBetween>
          <S.Name> {name} </S.Name>
          <S.ToggleIcon
            onClick={this.expanded.toggle}
            active={this.expanded.value}
            onIcon={faCaretUp}
            offIcon={faCaretDown}
          />
        </A.Horizontal>
        <A.Space size={3} />

        {description && (
          <Fragment>
            <S.Description>{description}</S.Description>
            <A.Space size={1} />
          </Fragment>
        )}

        <ScriptDefinition definition={definition} />

        {this.expanded.value === true && <S.Definition>{definition}</S.Definition>}
      </S.NpmScript>
    );
  }
}

export default NpmScript;
