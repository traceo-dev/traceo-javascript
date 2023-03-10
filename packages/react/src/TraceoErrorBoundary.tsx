import React from "react";
import { IBrowserClient } from "@traceo-sdk/browser";

type ErrorBoundaryProps = {
  instance: IBrowserClient;
  action?: string;
  children: React.ReactNode;
  fallback?: Function;
};

type ErrorBoundaryState = {
  error?: Error;
  stacktrace?: string;
};

export class TraceoErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    error: undefined,
    stacktrace: undefined
  };

  public componentDidCatch(
    error: Error & { cause?: Error },
    { componentStack }: React.ErrorInfo
  ): void {
    const { instance } = this.props;

    instance.sendError(error);
    this.setState({ error, stacktrace: componentStack });
  }

  public render(): React.ReactNode {
    if (this.state.error) {
      return this.props.fallback ? this.props.fallback(this.state.error) : null;
    }

    return this.props.children;
  }
}
