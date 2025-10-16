
import React, { createContext, useReducer, useContext, ReactNode } from 'react';

type User = {
  name: string;
  email: string;
};

type UserState = {
  isAuthenticated: boolean;
  user: User | null;
};

type UserAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
