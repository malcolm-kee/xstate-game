import cx from 'classnames';
import * as React from 'react';
import classes from './paper.module.scss';

export const Paper: React.FC<{ className?: string }> = ({
  children,
  className,
}) => <div className={cx(classes.paper, className)}>{children}</div>;
