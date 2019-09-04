import cx from 'classnames';
import * as React from 'react';
import classes from './button.module.scss';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => (
  <button className={cx(classes.btn, className)} {...props} />
);
