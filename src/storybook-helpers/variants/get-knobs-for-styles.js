import { boolean, number } from '@storybook/addon-knobs/react';
const range = (min, max, def = min) => [def, { range: true, min, max }];

const originalStyles = {
  spaceBetweenVariants: 10,
  spaceBetweenGroups: 20,
  columns: 3,
  displayVariantName: false,
  displayGroupName: true,
  centerVariantName: false,
  hasPadding: true
};

const stylesGroupId = 'Styles';

const getKnobsForStyles = (overrides = {}) => {
  const stylez = {
    ...originalStyles,
    ...overrides
  };

  const displayVariantName = boolean('Display variant name', stylez.displayVariantName, stylesGroupId);
  const displayGroupName = boolean('Display group name', stylez.displayGroupName, stylesGroupId);
  const hasPadding = boolean('Has padding', stylez.hasPadding, stylesGroupId);
  const centerVariantName = boolean('Center variant name', stylez.centerVariantName, stylesGroupId);
  const spaceBetweenVariants = number(
    'Space between variants',
    ...range(10, 50, stylez.spaceBetweenVariants),
    stylesGroupId
  );
  const spaceBetweenGroups = number(
    'Space between groups',
    ...range(20, 150, stylez.spaceBetweenGroups),
    stylesGroupId
  );
  const columns = number('Columns', ...range(1, 15, stylez.columns), stylesGroupId);

  return {
    spaceBetweenVariants,
    spaceBetweenGroups,
    columns,
    displayVariantName,
    displayGroupName,
    centerVariantName,
    hasPadding
  };
};

export default getKnobsForStyles;
