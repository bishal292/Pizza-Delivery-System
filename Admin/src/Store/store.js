import { create } from "zustand";
import { UserAuthSlice, userUtilSlice } from "./slices/userSlices";



const commonSlices = (set,get) => ({
  theme: "light",
  changeTheme: () =>{
    const selectedtheme = get().theme;
    set({ theme: selectedtheme === "dark" ? "light" : "dark" });
  },
});



export const useAppStore = create()((...a) => ({
  ...UserAuthSlice(...a),
  ...userUtilSlice(...a),
  ...commonSlices(...a),
}));