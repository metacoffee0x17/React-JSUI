import React, { Component, Fragment } from 'react';
import { Tooltip } from 'react-tippy';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import Boolean from 'models/Boolean';

import { observer } from 'mobx-react';

@observer
class CrossEnvMatches extends Component {
  collapsed = Boolean.create({ value: this.props.matches.length > 1 });

  render() {
    const { matches } = this.props;

    return (
      <S.CrossEnvMatches>
        {this.collapsed.value && (
          <Tooltip
            html={matches.map(([full, name, value]) => (
              <Fragment>
                <S.Table.Wrap onClick={this.collapsed.toggle}>
                  <S.Table.Name>{name}</S.Table.Name>
                  <S.Table.Value>{value}</S.Table.Value>
                </S.Table.Wrap>
                <A.Space size={1} />
              </Fragment>
            ))}
          >
            <S.Match onClick={this.collapsed.toggle}>
              <S.Name>env variables</S.Name>
            </S.Match>
          </Tooltip>
        )}
        {!this.collapsed.value &&
          matches.map(([full, name, value]) => (
            <S.Match onClick={this.collapsed.toggle}>
              <S.Name>{name}</S.Name>=<S.Value>{value}</S.Value>
            </S.Match>
          ))}
      </S.CrossEnvMatches>
    );
  }
}

export default CrossEnvMatches;
