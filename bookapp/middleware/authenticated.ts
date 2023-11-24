// export default function ({ redirect, route }) {
//     // If the user is not on the login page
//     if (route.name !== 'index') {
//       // get token if existing
//       const token = localStorage.getItem('token')
//       if (!token) {
//         console.log('no token')
//         return redirect('/');
//       }
//     }
//   }


export default defineNuxtRouteMiddleware((to, from) => {
  console.log('from name: ', from.name)
  console.log('to name: ', to.name)
  if (from.name !== 'index') {
    // get token if existing
    const token = localStorage.getItem('token')
    console.log('token middleware: ', token)
    console.log(token === undefined)
    if (token === undefined) {
      console.log('no token')
      return navigateTo('/');
    }
  }
})