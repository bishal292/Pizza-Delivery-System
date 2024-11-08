import { create } from "zustand";
import { UserAuthSlice, userUtilSlice } from "./slices/userSlices";
import { AdminAuthSlice, adminUtilSlice } from "./slices/adminSlices";



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

// export const useAdminStore = create()((...a) => ({
//   ...AdminAuthSlice(...a),
//   ...adminUtilSlice(...a),
// }));

// export const useCommonStore = create()((...a) => ({
//     ...commonSlices(...a),
// }));


