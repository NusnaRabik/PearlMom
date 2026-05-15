import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  // Dummy implementation since actual auth isn't requested deeply
  return <>{children}</>;
};
