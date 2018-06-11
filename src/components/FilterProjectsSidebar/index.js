import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import truncate from 'lodash/truncate';
import { Tooltip } from 'react-tippy';
import { PROJECT_PRIVACY, PROJECT_REPO } from 'config/enums';
import { bindStringToInput } from 'utils/bind-utils';
import { enumToValueAndLabel } from 'utils/enum-utils';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';

//components
import Sidebar from 'components/Sidebar';
import CollapsibleSection from 'components/CollapsibleSection';
import MiniTabs from 'components/MiniTabs';
import CheckMultipleList from 'components/CheckMultipleList';
import ConditionalWrap from 'conditional-wrap';
import QuestionIcon from 'components/QuestionIcon';

const ConditionalTooltip = ({ condition, children, ...rest }) => (
  <ConditionalWrap condition={condition} wrap={children => <Tooltip {...rest}>{children}</Tooltip>}>
    {children}
  </ConditionalWrap>
);

const DependencyLabel = ({ name, count }) => {
  const truncatedName = truncate(name, { length: 22, separator: '...' });
  return (
    <ConditionalTooltip condition={name !== truncatedName} title={name} position="right">
      <div>
        <span>({count})</span> <span>{truncatedName}</span>
      </div>
    </ConditionalTooltip>
  );
};

@inject('store')
@observer
class FilterProjectsSidebar extends Component {
  render() {
    const { store } = this.props;
    const { projectFilters, groups, currentDependencies } = store;
    const {
      hiddenGroups,
      selectedDependencies,
      searchText,
      hiddenPrivacyTypes,
      hiddenRepoTypes
    } = projectFilters;

    const spacing = 2;
    const spacingBetweenOptions = 4;

    return (
      <S.FilterProjectsSidebar>
        <Sidebar>
          {/* SEARCH */}
          <A.TextInput {...bindStringToInput(searchText)} type="text" placeholder="Search by name" />
          <A.Space size={spacingBetweenOptions} />

          {/* GROUPS */}
          <S.Title>Groups</S.Title>
          <A.Space size={spacing} />

          <CheckMultipleList
            onCheck={item => hiddenGroups.toggle(item.value)}
            list={groups.map(({ name, id }) => ({
              value: id,
              label: name,
              checked: !hiddenGroups.items.includes(id)
            }))}
            inverse={true}
          />

          <A.Space size={spacingBetweenOptions} />

          {/* PRIVACY */}
          <A.Horizontal centerV noShrink spaceAll={5}>
            <S.Title>Privacy</S.Title>
            <QuestionIcon tip={`Based on "private" in package.json`} />
          </A.Horizontal>

          <A.Space size={spacing} />
          <MiniTabs
            onSelect={item => hiddenPrivacyTypes.toggle(item.value)}
            list={enumToValueAndLabel(PROJECT_PRIVACY).map(item => ({
              ...item,
              selected: !hiddenPrivacyTypes.items.includes(item.value)
            }))}
            small
          />

          <A.Space size={spacingBetweenOptions} />

          {/* PROJECT TYPE */}
          <S.Title>Repo</S.Title>
          <A.Space size={spacing} />

          <MiniTabs
            onSelect={item => hiddenRepoTypes.toggle(item.value)}
            list={enumToValueAndLabel(PROJECT_REPO).map(item => ({
              ...item,
              selected: !hiddenRepoTypes.items.includes(item.value)
            }))}
            small
            onClick={tab => console.log(tab)}
            tabsEnum={PROJECT_REPO}
          />

          <A.Space size={spacingBetweenOptions} />

          <CollapsibleSection
            space={spacing}
            initialShow={true}
            title={<S.Title>Filter by dependencies</S.Title>}
          >
            <CheckMultipleList
              onCheck={item => selectedDependencies.toggle(item.value)}
              list={currentDependencies.map(({ name, count }) => ({
                label: <DependencyLabel count={count} name={name} />,
                value: name,
                checked: selectedDependencies.items.includes(name)
              }))}
            />
          </CollapsibleSection>
        </Sidebar>
      </S.FilterProjectsSidebar>
    );
  }
}

export default FilterProjectsSidebar;
