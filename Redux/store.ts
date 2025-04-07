import { configureStore } from "@reduxjs/toolkit";
import habitReducer from '../features/habit/habitSlice';
import userReducer from '../features/users/userSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            habits: habitReducer,
            user: userReducer
        }
    })
}

export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
export type AppStore = ReturnType<typeof makeStore>;