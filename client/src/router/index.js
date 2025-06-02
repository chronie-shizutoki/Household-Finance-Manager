import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useUserStore } from '@/stores/user' // 导入userStore

/**
 * 应用路由配置
 * @module router
 * @desc 使用Vue Router管理前端路由，包含历史模式配置和路由守卫
 */
import i18n from '@/locales/i18n.js' // 导入i18n实例

const router = createRouter({
  history: createWebHistory(), // 启用History模式（去除URL中的#号）
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'app.title' }, // 路由元信息：对应i18n的键
      component: HomeView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// 全局前置守卫：每次路由切换时更新页面标题
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = i18n.global.t(to.meta.title)
  }
  // 示例：在守卫内部调用store（假设需要验证登录状态）
  const userStore = useUserStore(); // 确保在守卫函数内部调用useStore
});

export default router