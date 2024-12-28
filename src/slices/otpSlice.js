import { createSlice } from "@reduxjs/toolkit";

const initialState = {
email:null,
}
const otpSlice =createSlice({
    name: "otp",
    initialState: initialState,
    reducers:{
        setEmail(state,value){
            state.email = value.payload
                },
   
    },                                
}
)
export const {setEmail} = otpSlice.actions;
export default otpSlice.reducer;  
