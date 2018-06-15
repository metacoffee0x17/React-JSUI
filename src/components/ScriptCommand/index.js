import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';

import { faTrash, faCopy, faFolderOpen } from '@fortawesome/fontawesome-free-solid';
import { faReact, faVuejs, faNodeJs } from '@fortawesome/fontawesome-free-brands';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import { getArrayOfRegexMatches, getRegexResults } from 'utils/regex-utils';
import {
  runCommandRegex,
  crossEnvRegex,
  rimRafRegex,
  reactRegex,
  vueRegex,
  changeDirRegex,
  copyRegex,
  nodeRegex,
  jestRegex,
  prettierRegex,
  flowRegex
} from 'config/regex-expressions';
import CrossEnvMatches from 'components/ScriptCommand/components/CrossEnvMatches';

const IconWithText = ({ styles, name, icon, children }) => (
  <S.ScriptCommand styles={styles}>
    <A.Horizontal centerV>
      {icon ? <S.Icon icon={icon} /> : name}
      <A.Space size={1} />
      <div>{children}</div>
    </A.Horizontal>
  </S.ScriptCommand>
);

const simpleIconsMap = [
  {
    regex: rimRafRegex,
    styles: {
      backgroundColor: '#bd6868'
    },
    icon: faTrash
  },
  {
    regex: flowRegex,
    styles: {
      backgroundColor: '#e7bc44'
    }
  },
  {
    regex: reactRegex,
    icon: faReact,
    styles: {
      backgroundColor: '#292c34',
      color: '#66dbf9'
    }
  },
  {
    regex: vueRegex,
    icon: faVuejs,
    styles: {
      backgroundColor: '#47b784'
    }
  },
  {
    regex: copyRegex,
    icon: faCopy,
    styles: {
      backgroundColor: '#47b784'
    }
  },
  {
    regex: changeDirRegex,
    icon: faFolderOpen,
    styles: {
      backgroundColor: 'orange'
    }
  },
  {
    regex: nodeRegex,
    icon: faNodeJs,
    styles: {
      backgroundColor: '#4fad54'
    }
  },
  {
    regex: jestRegex,
    styles: {
      backgroundColor: '#974350'
    }
  },
  {
    regex: prettierRegex,
    styles: {
      backgroundColor: '#1b2b34'
    }
  }
];

const regexToIconMap = [
  {
    regex: runCommandRegex,
    component: ({ matches, highlightedCommand }) => {
      const commandName = matches[2] || matches[4];
      const highlighted = highlightedCommand && commandName === highlightedCommand.value;
      return (
        <S.ScriptCommand green highlighted={highlighted} onMouseEnter={this.hover} onMouseOut={this.unhover}>
          {commandName}
        </S.ScriptCommand>
      );
    }
  },
  ...simpleIconsMap.map(({ regex, ...iconProps }) => ({
    regex,
    component: ({ matches }) => {
      return (
        <IconWithText name={matches[1]} {...iconProps}>
          {matches[2]}
        </IconWithText>
      );
    }
  }))
];

@inject('scripts')
@observer
class ScriptCommand extends Component {
  render() {
    const { command, scripts } = this.props;
    const { highlightedCommand } = scripts;
    const otherProps = { highlightedCommand };

    const crossEnvMatches = getArrayOfRegexMatches(command, crossEnvRegex);

    let component;
    regexToIconMap.find(r => {
      const { result, matches } = getRegexResults(command, r.regex);
      if (result === true) {
        component = r.component({ matches, ...otherProps });
        return true;
      }
    });

    if (component) {
      return component;
    }

    if (crossEnvMatches.length > 0) {
      return <CrossEnvMatches matches={crossEnvMatches} />;
    }

    return <S.ScriptCommand>{command}</S.ScriptCommand>;
  }
}

export default ScriptCommand;
