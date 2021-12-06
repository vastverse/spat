import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	id: "",
	email: "",
	name: "",
	imageUrl: "",
	subscribed: "",
};

export const userInfo = createSlice({
	name: "userDetails",
	initialState,
	reducers: {
		addUserDetails: (state, action) => {
			state.id = action.payload.id;
			state.email = action.payload.email;
			state.name = action.payload.name;
			state.imageUrl = action.payload.imageUrl;
			state.subscribed = action.payload.subscribed;
		},
	},
});
export const { addUserDetails } = userInfo.actions;
export const selectUserDetails = (state) => state.userDetails;
export default userInfo.reducer;
