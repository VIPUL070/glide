import { IVehicle } from '@/models/Vehicle.model';
import { createSlice} from '@reduxjs/toolkit';

interface IVehicleState {
  vehicles: IVehicle | null;
}

const initialState: IVehicleState = {
  vehicles: null,
};

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setVehicles: (state, action) => {
      state.vehicles = action.payload;
    }
  },
});

export const { setVehicles } = vehicleSlice.actions;
export default vehicleSlice.reducer;