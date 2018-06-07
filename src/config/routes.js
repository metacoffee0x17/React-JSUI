import React from 'react';

import Home from 'views/Home';
import Settings from 'views/Settings';
import ProjectView from 'views/ProjectView';

const routes = {
  home: {
    id: 'home',
    path: '/',
    extra: {
      component: <Home />
    }
  },
  project: {
    id: 'project',
    path: '/project/:id',
    extra: {
      component: <ProjectView />
    }
  }
};

export default routes;
