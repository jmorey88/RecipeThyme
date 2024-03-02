import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

export const AuthRoute = ({ children }) => {
  const loggedIn = Boolean(useSelector(state => state.session.currentUser));
  return !loggedIn ? children : <Navigate to="/recipe-gallery" replace />;
};

export const ProtectedRoute = ({ children }) => {
  const loggedIn = Boolean(useSelector(state => state.session.currentUser));
  return loggedIn ? children : <Navigate to="/login" replace />;
};
