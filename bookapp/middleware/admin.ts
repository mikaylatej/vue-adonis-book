export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
      const type = localStorage.getItem('userType')
      console.log('middleware usertype: ', type)
      if (type !== 'Admin') {
        return navigateTo('/api/unauthorized')
      }
    }
  })