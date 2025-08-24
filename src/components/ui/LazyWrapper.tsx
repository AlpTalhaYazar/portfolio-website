"use client";

import { Suspense, ReactNode } from "react";

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * Wrapper component for lazy-loaded components with better loading states
 */
export default function LazyWrapper({
  children,
  fallback = null,
  className,
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {className ? <div className={className}>{children}</div> : children}
    </Suspense>
  );
}
