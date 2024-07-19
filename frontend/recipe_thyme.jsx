import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { setUser } from './features/sessions/sessionSlice';
import './utils/global.module.css';

const getCurrentUser = () => {
  const userDataElement = document.getElementById('user-data');
  if (!userDataElement) return null;

  const userData = JSON.parse(userDataElement.textContent || '{}');
  return userData.current_user;
};

const currentUser = getCurrentUser();

if (currentUser)  {
  store.dispatch(setUser({ currentUser }));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)