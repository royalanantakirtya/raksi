import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <div className={`pt-20 pb-24 px-4 ${className}`}>
      {children}
    </div>
  );
}
