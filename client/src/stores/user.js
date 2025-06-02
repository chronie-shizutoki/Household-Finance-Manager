import { defineStore } from 'pinia'

// 用户状态存储
export const useUserStore = defineStore('user', {
  state: () => ({ 
    isLoggedIn: false, 
    userInfo: null 
  }),
  actions: {
    login(userData) {
      this.isLoggedIn = true;
      this.userInfo = userData;
    },
    logout() {
      this.isLoggedIn = false;
      this.userInfo = null;
    }
  }
})