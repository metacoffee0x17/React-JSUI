import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';

import { faTrash, faUpload, faArrowsAlt } from '@fortawesome/fontawesome-free-solid';

//emotion
import * as S from './styles';
import { Horizontal, Vertical } from 'styles/flex-components';

const IconButton = ({ tip, icon, onClick }) => (
  <Tooltip title={tip}>
    <S.SmallIcon.Button onClick={onClick}>
      <S.SmallIcon.Icon icon={icon} />
    </S.SmallIcon.Button>
  </Tooltip>
);

class DependenciesList extends Component {
  render() {
    const { list = {}, isDev, onUpgrade, onMove, onDelete } = this.props;

    return (
      <S.DependenciesList>
        <Vertical spaceAll={3}>
          {Object.entries(list).map(
            ([name, version]) =>
              typeof name === 'string' &&
              typeof version === 'string' && (
                <S.Dependency.Wrap>
                  <S.Dependency.Name>
                    {name} {version}
                  </S.Dependency.Name>
                  <S.Icons spaceAll={5}>
                    <IconButton
                      icon={faTrash}
                      tip={`Delete ${name}`}
                      onClick={() => onDelete(name, version, isDev)}
                    />
                    <IconButton
                      icon={faUpload}
                      tip={`Update ${name}`}
                      onClick={() => onUpgrade(name, version, isDev)}
                    />
                    <IconButton
                      icon={faArrowsAlt}
                      tip={isDev ? 'Move to dependencies' : 'Move to dev dependencies'}
                      onClick={() => onMove(name, version, isDev)}
                    />
                  </S.Icons>
                </S.Dependency.Wrap>
              )
          )}
        </Vertical>
      </S.DependenciesList>
    );
  }
}

export default DependenciesList;
