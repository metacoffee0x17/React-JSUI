import React from 'react';
import { Switch, Select, MenuItem, FormControlLabel, InputLabel } from '@material-ui/core';
import { TextField, SelectClasses, InputLabelClasses, LabelClasses } from 'styles/material-ui-overrides';
import * as A from 'styles/shared-components';

export const InputAdapter = ({ input: { onChange, value }, ...rest }) => (
  <TextField
    value={value}
    onChange={e => onChange(e.target.value)}
    label={rest.label || rest.placeholder}
    type="text"
    {...rest}
  />
);

export const SelectAdapter = ({ input: { onChange, value }, option }) => (
  <A.Vertical>
    <InputLabel classes={InputLabelClasses}>{option.name}</InputLabel>
    <Select classes={SelectClasses} value={value} onChange={onChange}>
      {option.options.map(option => <MenuItem value={option.value}>{option.label}</MenuItem>)}
    </Select>
  </A.Vertical>
);

export const SwitchAdapter = ({ input: { onChange, value }, option }) => (
  <FormControlLabel
    label={option.name}
    classes={LabelClasses}
    control={<Switch checked={value} onChange={(e, c) => onChange(c)} />}
  />
);
