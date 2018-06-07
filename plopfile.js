module.exports = function(plop) {
  /* Helpers */
  plop.addHelper('upperCase', function(text) {
    return text.toUpperCase();
  });

  var files = {
    index: 'plop-templates/index.js',
    story: 'plop-templates/stories.js',
    indexConnected: 'plop-templates/index-connected.js',
    styles: 'plop-templates/styles.js',
    mstModel: 'plop-templates/mst-model.js',
    dialog: {
      index: 'plop-templates/Dialog/index.js',
      style: 'plop-templates/Dialog/styles.js'
    }
  };

  /* Files */

  var createComponent = function(data) {
    const isNested = data.nested && data.nested.trim() !== '';

    const prefix = isNested
      ? 'src/components/{{pascalCase nested}}/components/{{pascalCase name}}/'
      : 'src/components/{{pascalCase name}}/';

    return [
      {
        type: 'add',
        path: prefix + 'styles.js',
        templateFile: files.styles
      },
      {
        type: 'add',
        path: prefix + 'index.js',
        templateFile: files.index
      },
      {
        type: 'add',
        path: prefix + 'stories.js',
        templateFile: files.story
      }
    ];
  };

  var createViewStory = {
    type: 'add',
    path: 'src/views/{{pascalCase name}}/stories.js',
    templateFile: files.story
  };

  /* Files */

  var createView = {
    type: 'add',
    path: 'src/views/{{pascalCase name}}/index.js',
    templateFile: files.index
  };

  var createDialog = {
    type: 'add',
    path: 'src/components/{{pascalCase name}}/index.js',
    templateFile: files.dialog.index
  };

  var createDialogStyle = {
    type: 'add',
    path: 'src/components/{{pascalCase name}}/styles.js',
    templateFile: files.dialog.style
  };

  var createMstModel = {
    type: 'add',
    path: 'src/models/{{pascalCase name}}.js',
    templateFile: files.mstModel
  };

  var createViewStyle = {
    type: 'add',
    path: 'src/views/{{pascalCase name}}/styles.js',
    templateFile: files.styles
  };

  /* Questions */
  var getComponentName = {
    type: 'input',
    name: 'name',
    message: 'Name?',
    validate: function(value) {
      if (/.+/.test(value)) {
        return true;
      }
      return 'name is required';
    }
  };

  var getNestedFolder = {
    type: 'input',
    name: 'nested',
    message: 'Nest it in a folder?'
  };

  /* Options */
  plop.setGenerator('Component', {
    description: 'Generate a component',
    prompts: [getComponentName, getNestedFolder],
    actions: function(data) {
      return createComponent(data);
    }
  });

  plop.setGenerator('View', {
    description: 'Generate a view component',
    prompts: [getComponentName],
    actions: [createView, createViewStyle, createViewStory]
  });

  plop.setGenerator('Dialog', {
    description: 'Generate a dialog component',
    prompts: [getComponentName],
    actions: [createDialog, createDialogStyle]
  });

  plop.setGenerator('MST Model', {
    description: 'Generate a mobx-state-tree model',
    prompts: [getComponentName],
    actions: [createMstModel]
  });
};
