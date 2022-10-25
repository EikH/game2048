import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import boardSlice from './boardSlice';

const store = configureStore({
	reducer: {
		boards: boardSlice.reducer,
	},
});

setupListeners(store.dispatch);
export default store;
