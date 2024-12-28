// ErrorBoundary.js
import React from "react";
import Img35 from './assests/img35.png'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <div className="w-80" ><img src={Img35} alt="" /></div>
          <div className="text-2xl sm:text-4xl font-bold font-inter">oops!! Something went wrong.</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
