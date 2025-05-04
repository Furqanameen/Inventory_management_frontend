/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Component } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert } from '@mantine/core';

/**
 * ErrorBoundary is a React component that handles errors in its child components.
 * See: https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends Component {
  // readonly state;

  constructor(props) {
    super(props);
    this.state = { lastLocation: window.location.toString() };
  }

  static getDerivedStateFromError(error) {
    return { error, lastLocation: window.location.toString() };
  }

  componentDidUpdate(_prevProps, _prevState) {
    if (window.location.toString() !== this.state.lastLocation) {
      this.setState({
        lastLocation: window.location.toString(),
        error: undefined,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.children !== nextProps.children) {
      return true;
    }
    if (nextState.error && !this.state.error) {
      return true;
    }
    if (this.state.lastLocation !== window.location.toString()) {
      return true;
    }
    return false;
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <Alert icon={<IconAlertCircle size={16} />} title="Something went wrong" color="red">
          {/* {normalizeErrorString(this.state.error)} */}
          {this.state.error}
        </Alert>
      );
    }

    return this.props.children;
  }
}
