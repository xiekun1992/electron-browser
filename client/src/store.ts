/* eslint-disable @typescript-eslint/no-explicit-any */
import {create} from 'zustand'

// create a store to hold our application's state
const useAppStore = create((set) => ({
    views: [],
    activeId: -1,
    setViews(views: any) {
        return set({
            views
        })
    },
    setActiveId(activeId) {
        return set({
            activeId
        })
    }
//   loggedInUser: null,
//   notifications: [],
//   setLoggedInUser: (user) => set({ loggedInUser: user }),
//   addNotification: (notification) =>
//     set((state) => ({ notifications: [...state.notifications, notification] })),
//   clearNotifications: () => set({ notifications: [] }),
}))

export default useAppStore