import map from 'lodash/map';

export const enumToValueAndLabel = en => map(en, tab => ({ value: tab, label: tab }));
