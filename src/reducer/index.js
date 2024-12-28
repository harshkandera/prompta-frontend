import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice"
import{persistReducer} from "redux-persist"
import storage from 'redux-persist/lib/storage'; 
import authenticationReducer from "../slices/authenticationSlice";
import otpReducer from "../slices/otpSlice";
import profileDataReducer from "../slices/profileSetupSlice"
const rootReducer =combineReducers({
auth:authReducer,
profile:profileReducer,
loading:authenticationReducer,
otp:otpReducer,
profileData:profileDataReducer
})

const persistConfig ={
    key :'root',
    storage,
    version:1,
}


const persistedReducer = persistReducer(persistConfig,rootReducer)



export default persistedReducer;
