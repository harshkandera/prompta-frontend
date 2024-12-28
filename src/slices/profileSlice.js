import { createSlice } from "@reduxjs/toolkit";

const initialState = {
user:null,
error:null,
loading:false,
istoken:false,
isOpen1:false,
assignmentData:null,
}
const profileSlice =createSlice({
    name: "profile",
    initialState: initialState,
    reducers:{
        setUser(state,value){
            state.user = value.payload
        
                },
        signInStart:(state)=>{
            state.loading=true;
        },
        signInFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        signInSuccess:(state,action)=>{
            state.user = action.payload;
            state.loading=false;
            state.error=null;
        }
        ,
        setIstoken:(state,action)=>{
            state.istoken=action.payload;
        },
        setIsOpen1:(state,action)=>{
            state.isOpen1=action.payload;

        },
        setAssignmentData(state,action){
            state.assignmentData=action.payload
        }
    },                                
}
)
export const {setUser,signInFailure,signInStart,signInSuccess,setIstoken,setIsOpen1,setAssignmentData} = profileSlice.actions;
export default profileSlice.reducer;  
