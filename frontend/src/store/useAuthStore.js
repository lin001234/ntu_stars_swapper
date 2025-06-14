import { create } from "zustand";
import { axiosInstance } from "../components/axios";
import { io } from "socket.io-client";
const BASE_URL = 'http://localhost:3000'; // Make sure BASE_URL is properly defined.

export const useAuthStore = create((set,get) =>({
    authUser:null,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
        const res = await axiosInstance.get("/profile");
        
        console.log('checkAuth: Response from /profile:', res.data);
        set({ authUser: res.data });
        get().connectSocket();
        console.log('checkAuth: authUser set:', get().authUser);
        } catch (error) {
        console.log("Error in checkAuth:", error);
        set({ authUser: null });
        } finally {
        set({ isCheckingAuth: false });
        }
    },

    logout: async () => {
        try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        get().disconnectSocket();
        } catch (error) {
        toast.error(error.response.data.message);
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        const userId = authUser?.user?.id; 
        if (!userId  || get().socket?.connected) return;

        const socket = io(BASE_URL, {
        query: {
            userId,
        },
        });

        socket.on('connect', ()=>{
            console.log('Socket connected,', socket.id);
        })

        socket.on("getOnlineUsers", (userIds) => {
        console.log('connectSocket: Received online users:', userIds);
        set({ onlineUsers: userIds });
        });
        socket.connect();
        set({socket});
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}))