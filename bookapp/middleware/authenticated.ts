export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem('token')

    if (to.name !== 'index' && token==='undefined') {
      return navigateTo('/')
    }
  }
})