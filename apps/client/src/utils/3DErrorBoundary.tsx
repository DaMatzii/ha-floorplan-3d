import React from "react";
import { extend } from "@react-three/fiber";

interface R3FErrorBoundaryProps {
  children: React.ReactNode;
  onError: (error: any) => void;
  fallback?: React.ReactNode | undefined;
}

interface R3FErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  onError: (error: any) => void;
  fallback: React.ReactNode | undefined;
}

export default class R3FErrorBoundary extends React.Component<
  R3FErrorBoundaryProps,
  R3FErrorBoundaryState
> {
  constructor(props: R3FErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      onError: props.onError,
      fallback: props.fallback,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.state.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return this.state.fallback ?? <></>;
    }

    return <>{this.props.children}</>;
  }
}

extend({ R3FErrorBoundary });
