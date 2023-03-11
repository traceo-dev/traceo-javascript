import React from "react";
import { IBrowserClient } from "@traceo-sdk/browser";

type FallbackProps = (props?: { error: Error; componentStack: string }) => React.ReactElement;

type ErrorBoundaryProps = {
  traceo: IBrowserClient;
  children: React.ReactNode;
  fallback?: FallbackProps;
  onError?(error: Error, componentStack: string): void;
};

type ErrorBoundaryState = {
  error?: Error;
  stacktrace?: string;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    error: undefined,
    stacktrace: undefined
  };

  public componentDidCatch(error: Error, { componentStack }: React.ErrorInfo): void {
    const { traceo, onError } = this.props;

    if (onError) {
      onError(error, componentStack);
    }

    traceo.sendError(error);
    this.setState({ error, stacktrace: componentStack });
  }

  public render(): React.ReactNode {
    const { children, fallback } = this.props;
    const { error, stacktrace } = this.state;

    if (error) {
      if (fallback) {
        return fallback({
          error,
          componentStack: stacktrace as string
        });
      }

      return null;
    }

    return children;
  }
}
