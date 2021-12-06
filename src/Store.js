import { configureStore } from "@reduxjs/toolkit";
import { userInfo } from "./userreducer";

const store = configureStore({
	reducer: {
		userDetails: userInfo.reducer,
	},
});

export default store;
