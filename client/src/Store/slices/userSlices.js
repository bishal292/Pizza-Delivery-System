export const UserAuthSlice = (set) => (
    {
        userInfo:undefined,
        setUserInfo: (userInfo) => set(() => ({ userInfo })),
    }
)

export const userUtilSlice = (set, get) => (
    {
    }
)