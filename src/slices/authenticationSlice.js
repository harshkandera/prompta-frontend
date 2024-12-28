import { createSlice } from "@reduxjs/toolkit";

const initialState = {
loading:false,
}
const authenticationSlice =createSlice({
    name: "loading",
    initialState: initialState,
    reducers:{
        setLoading(state,value){
            state.user = value.payload
                },
    
    },                                
}
)
export const {setLoading} = authenticationSlice.actions;
export default authenticationSlice.reducer;  
