<template>
  <header class="sticky top-0 z-50 relative flex h-16 items-center space-x-1 justify-between bg-gray-800 p-4 shadow-md">
    <!-- <header class="sticky top-0 z-50 justify-between items-center space-x-1 border-b bg-gray-800 p-4 shadow-md"> -->
    <!-- left -->
    <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">

      <div class="flex flex-shrink-0 items-center">
        <a href="/api/books">
          <img class="h-8 w-auto" src="https://www.pngkit.com/png/full/31-316559_white-home-icon-no-background.png"
            alt="Your Company">
        </a>
      </div>
      <div class="hidden sm:ml-6 sm:block">
        <div class="flex space-x-4">
          <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
          <a href="/api/books" :class="booksActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'" class="rounded-md px-3 py-2 text-sm font-medium"
            aria-current="page">Books</a>
          <a href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Orders</a>
        </div>
      </div>
    </div>
    <!-- right -->
    <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      <!-- Profile dropdown -->
      <div class="relative ml-3">
        <div>
          <button type="button" class="relative flex rounded-full bg-gray-800 text-sm"
            :class="openNavDropdown ? 'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800' : ''"
            id="user-menu-button" aria-expanded="false" aria-haspopup="true" @click="openNav">
            <span class="absolute -inset-1.5"></span>
            <span class="sr-only">Open user menu</span>
            <img class="h-8 w-8 rounded-full"
              src="https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"
              alt="">
          </button>
        </div>

        <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          -->
        <div v-show="openNavDropdown"
          class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
          <a :href="profilePage" class="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700" role="menuitem"
            tabindex="-1" id="user-menu-item-0">Your Profile</a>
          <a href="/api/account/permissions" v-if="permissionTab"
            class="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1"
            id="user-menu-item-1">User Permissions</a>
          <a href="#" class="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1"
            id="user-menu-item-2" @click="handleLogout">Log out</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import axios from 'axios';
export default {
  data: () => ({
    // token: {},
    openNavDropdown: false,
    profilePage: '',
    permissionTab: false,
    booksActive: false
  }),
  async mounted() {
    this.activeTab()
    await this.setUserId()
    this.showPermissions()
  },
  methods: {
    activeTab() {
      const route = useRoute()
      console.log('route: ', route.path)
      if (route.path === '/api/books') {
        this.booksActive = true
      }
    },
    openNav() {
      this.openNavDropdown = !this.openNavDropdown
    },
    async handleLogout() {
      console.log('logout')
      const url = "http://127.0.0.1:3333/api/auth/logout"
      const token = localStorage.getItem('token')
      try {
        const { data } = await axios.post(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })

        console.log('data login: ' + data.token)
        this.token = data.token
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        localStorage.removeItem("userType")
        console.log('token after remove: ' + localStorage.getItem('token'))
        console.log('userId after remove: ' + localStorage.getItem('userId'))
        console.log('userType after remove: ' + localStorage.getItem('userType'))
        navigateTo({ path: '/' })
      } catch (e) {
        console.log(e)
      }
    },
    setUserId() {
      const userId = localStorage.getItem('userId')
      this.profilePage = '/api/account/' + userId
    },
    showPermissions() {
      try {
        // store login user id to localstorage
        console.log('user token: ' + localStorage.getItem('token'))
        // const route = useRoute()
        // const url = "http://127.0.0.1:3333/api/account/"
        // const token = localStorage.getItem('token')
        // const { data } = await axios.get(url, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // })
        // console.log("user type: ", data.user_type)
        // localStorage.setItem("userId", data.id)

        const userType = localStorage.getItem('userType')

        // show permission option in dropdown if admin
        console.log('userType === admin', userType === 'Admin')
        if (userType === 'Admin') {
          this.permissionTab = true
        }

      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
