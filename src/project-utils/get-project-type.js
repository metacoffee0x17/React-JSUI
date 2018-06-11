import { PROJECT_TAGS } from 'config/enums';

const hasModule = (entries, mod) => entries.find(([name]) => name === mod);
const hasModuleThatContains = (entries, mod) => entries.find(([name]) => name.includes(mod));

export const getProjectType = packageJson => {
  if (!packageJson) {
    return PROJECT_TAGS.UNKNOWN;
  }

  const { dependencies = {}, devDependencies = {} } = packageJson;
  const entries = [...Object.entries(dependencies), ...Object.entries(devDependencies)];

  const types = [
    {
      type: PROJECT_TAGS.ELECTRON,
      check: entries => {
        return hasModule(entries, 'electron');
      }
    },
    {
      type: PROJECT_TAGS.REACT_NATIVE,
      check: entries => {
        return hasModule(entries, 'react-native');
      }
    },
    {
      type: PROJECT_TAGS.GATSBY,
      check: entries => {
        return hasModule(entries, 'gatsby');
      }
    },
    {
      type: PROJECT_TAGS.EXPRESS,
      check: entries => {
        return hasModule(entries, 'express');
      }
    },
    {
      type: PROJECT_TAGS.PRISMA,
      check: entries => {
        return hasModule(entries, 'prisma-cli');
      }
    },
    {
      type: PROJECT_TAGS.GRAPHQL,
      check: entries => {
        return hasModuleThatContains(entries, 'graphql');
      }
    },
    {
      type: PROJECT_TAGS.REACT_WEB,
      check: entries => {
        let hasReact = hasModule(entries, 'react');
        let hasReactDom = hasModule(entries, 'react-dom');
        return hasReact && hasReactDom;
      }
    }
  ];

  let foundType = types.find(type => type.check(entries));
  return foundType ? foundType.type : PROJECT_TAGS.UNKNOWN;
};
