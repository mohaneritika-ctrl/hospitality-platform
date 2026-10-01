import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', small = false }) => {
  if (small) {
    return <div className="spinner spinner-sm" />;
  }

  return (
    <div className="spinner-center">
      <div className="spinner" />
      <span style={{ fontSize: '0.925rem', fontWeight: 500 }}>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
