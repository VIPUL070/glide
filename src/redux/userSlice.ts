import { createSlice } from '@reduxjs/toolkit'
import { IUser } from '@/models/User.model'

interface IUserState {
  userData : IUser | null;
}

const initialState: IUserState = {
  userData: null
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
     setUserData: (state,action) => {
        state.userData = action.payload
     }  
  },
})

export const { setUserData } = userSlice.actions

export default userSlice.reducer