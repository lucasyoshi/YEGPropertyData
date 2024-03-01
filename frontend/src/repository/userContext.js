import React from 'react';

const UserContext = React.createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export default UserContext;