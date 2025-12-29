import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          padding={3}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Произошла ошибка
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {this.state.error?.message || 'Неизвестная ошибка'}
          </Typography>
          <Button variant="contained" color="primary" onClick={this.handleReset} sx={{ mt: 2 }}>
            Попробовать снова
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
