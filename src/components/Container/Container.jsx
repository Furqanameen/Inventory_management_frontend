import { Container as MantineContainer } from '@mantine/core';
import classes from './Container.module.css';

export function Container(props) {
  // eslint-disable-next-line react/prop-types
  const { children, ...others } = props;

  return (
    <MantineContainer className={classes.root} {...others}>
      {children}
    </MantineContainer>
  );
}
