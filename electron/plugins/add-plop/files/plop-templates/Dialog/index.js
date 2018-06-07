import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

//emotion
import { {{properCase name}} , Content, Top} from './styles';

//components
import Buttons from 'components/Buttons';

@inject('store')
@observer
class {{properCase name}}Component extends Component {
  render() {
    const {store} = this.props;
    const {form} = this;

    return (
      <{{properCase name}}>
        <Content>
          <Top>
            <h1>{{properCase name}}</h1>
          </Top>

          <Buttons
            disabled={form.loading}
            buttons={[
              {
                onClick: store.closeDialog,
                label: 'Cancel'
              },
              {
                onClick: this.submit,
                label: form.loading ? 'Saving ... ' : 'Save'
              }
            ]}
          />
        </Content>
      </{{properCase name}}>
    );
  }
}

export default {{properCase name}}Component;
