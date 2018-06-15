import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import map from 'lodash/map';
import { types } from 'mobx-state-tree';
import { Provider } from 'mobx-react';
import groupBy from 'lodash/groupBy';
import partition from 'lodash/partition';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import Boolean from 'models/Boolean';
import String from 'models/String';

//component
import NpmScript from 'components/NpmScript';
import { createModel } from 'utils/mst-utils';
import ScriptsGroup from 'components/ScriptsGroup';

const ScriptsStore = types.model('ScriptsStore', {
  compact: createModel(Boolean),
  highlightedCommand: createModel(String)
});

const scriptsStore = ScriptsStore.create();

@observer
class ScriptsList extends Component {
  render() {
    const { packageJson } = this.props;

    const list = map(packageJson.scripts, (definition, name) => {
      return {
        name,
        definition,
        description: packageJson['scripts-info'] && packageJson['scripts-info'][name]
      };
    });

    const [withHooks, withoutHooks] = partition(list, item => {
      let hasAPre = packageJson.scripts[`pre${item.name}`];
      let hasAPost = packageJson.scripts[`post${item.name}`];
      let isAPre = item.name.startsWith('pre');
      let isAPost = item.name.startsWith('post');
      return hasAPre || hasAPost || isAPre || isAPost;
    });

    const [prefixed, single] = partition(withoutHooks, item => {
      const includesSemi = item.name.includes(':');
      if (includesSemi) {
        const splitted = item.name.split(':');
        return Object.entries(packageJson.scripts).find(
          ([a]) => a.includes(`${splitted[0]}:`) === true && a !== item.name
        );
      }
      return false;
    });

    const groupedPrefixed = groupBy(prefixed, item => item.name.split(':')[0]);

    const groupedWithHooks = groupBy(withHooks, item => {
      const separator = item.name.startsWith('post') ? 'post' : 'pre';
      if (item.name.startsWith('post') || item.name.startsWith('pre')) {
        return item.name.split(separator)[1];
      }
      return item.name;
    });

    const grouped = { ...groupedPrefixed, ...groupedWithHooks };

    return (
      <Provider scripts={scriptsStore}>
        <S.Groups>
          {map(grouped, (group, key) => <ScriptsGroup key={key} name={key} group={group} />)}
          <ScriptsGroup key="other" name="Other" group={single} />
        </S.Groups>
      </Provider>
    );
  }
}

export default ScriptsList;
