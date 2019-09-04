import * as React from 'react';
import classes from './paper.module.scss';

export const Paper: React.FC = ({ children }) => (
  <div className={classes.paper}>{children}</div>
);
