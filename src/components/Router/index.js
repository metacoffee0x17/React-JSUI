import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

class Router extends Component {
  render() {
    const { store } = this.props;
    const { router } = store;
    return router.extra ? router.extra.component : null;
  }
}

export default inject('store')(observer(Router));
