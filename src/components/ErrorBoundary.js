import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../styles/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorBox}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              {this.state.error && this.state.error.toString()}
            </Text>
            {__DEV__ && this.state.errorInfo && (
              <ScrollView style={styles.scrollView}>
                <Text style={styles.stack}>
                  {this.state.errorInfo.componentStack}
                </Text>
              </ScrollView>
            )}
            <Text style={styles.instruction}>
              Please refresh the page or check the browser console for details.
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorBox: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    maxWidth: 600,
    width: '100%',
    ...theme.shadows.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  message: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  scrollView: {
    maxHeight: 200,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  stack: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: theme.colors.textLight,
  },
  instruction: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
  },
});

export default ErrorBoundary;
