<template>
  <div>
    <NavBar />
    <div class="flex justify-center">
      <p class="text-2xl font-bold py-5 w-5/6">Account details of {{ user.name }}</p>
    </div>

    <div class="flex justify-center">
      <table class="table-auto center w-5/6 bg-slate-300 rounded-lg">
        <colgroup>
          <col span="1" style="width: 25%;">
          <col span="1" style="width: 75%;">
        </colgroup>
        <tr class="border-b-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Name</td>
          <td v-if="!updateMode" class="m-8 text-lg">{{ user.name }}</td>
          <td v-else class="m-8 text-lg">
            <input id="name" v-model="user.name" :placeholder="user.name" type="text">
          </td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">User Type</td>
          <td v-if="!updateMode" class="m-8 text-lg">{{ user.user_type }}</td>
          <td v-else class="m-8 text-lg">
            <select id="user-type" name="user-type" v-model="user.user_type">
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Location</td>
          <td v-if="!updateMode" class="m-8 text-lg">{{ user.location }}</td>
          <td v-else class="m-8 text-lg">
            <select id="location" name="location" v-model="user.location">
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Australia">Australia</option>
              <option value="Africa">Africa</option>
              <option value="North America">North America</option>
              <option value="South America">South America</option>
            </select>
          </td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Email</td>
          <td v-if="!updateMode" class="m-8 text-lg">{{ user.email }}</td>
          <td v-else class="m-8 text-lg">
            <input id="email" v-model="user.email" placeholder="Email" type="email" />
          </td>

        </tr>
      </table>
    </div>

    <div class="flex justify-center">
      <div class="w-5/6 my-5">
        <button v-show="!updateMode" class="rounded-full bg-amber-300 hover:bg-amber-400 px-3 py-1 float-right ml-2"
          @click="updateUser">Update</button>
        <button v-show="updateMode" class="rounded-full bg-green-300 hover:bg-green-400 px-3 py-1 float-right ml-2"
          @click="saveUpdate">Save
          Changes</button>
        <button v-show="updateMode" class="rounded-full bg-slate-300 hover:bg-slate-400 px-3 py-1 float-right ml-2"
          @click="cancelUpdate">Cancel
          Changes</button>
        <button class="rounded-full bg-red-300 hover:bg-red-400 px-3 py-1 float-right" @click="deleteUser">Delete
          Account</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/layout/NavBar.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

definePageMeta({
  middleware: [
    'authenticated',
  ],
});

export default {
  components: {
    NavBar
  },
  data: () => ({
    user: {},
    updateMode: false,
    name: '',
    email: ''
  }),
  async mounted() {
    await this.getUser()
  },
  methods: {
    async getUser() {
      try {
        console.log('user token: ' + localStorage.getItem('token'))
        const route = useRoute()
        // console.log('route name: ' + route.name)
        // console.log('route params id: ' + route.params.id)
        const url = "http://127.0.0.1:3333/api/account/" + route.params.id
        const token = localStorage.getItem('token')
        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.user = data
        this.email = data.email
      } catch (e) {
        console.log(e)
        const userId = localStorage.getItem('userId')
        return navigateTo('/api/account/' + userId)
      }
    },
    updateUser() {
      this.updateMode = true
    },
    cancelUpdate() {
      window.location.reload(true)
    },
    async saveUpdate() {
      try {
        this.updateMode = false
        // const route = useRoute()
        // console.log('route params id: ' + route.params.id)
        console.log("user id: " + this.user.id)
        const url = "http://127.0.0.1:3333/api/account/" + this.user.id
        const token = localStorage.getItem('token')
        console.log('token: ' + token)
        
        console.log(this.user.name)
        console.log(this.user.location)
        console.log(this.user.email)
        console.log(this.user.user_type)

        var user = {}
        console.log('this.email: ', this.email)
        if (this.email === this.user.email) {
          user = { 
            name: this.user.name,
            location: this.user.location,
            // email: this.user.email,
            user_type: this.user.user_type
          }
        } else {
          user = { 
            name: this.user.name,
            location: this.user.location,
            email: this.user.email,
            user_type: this.user.user_type
          }
        }
        const { data } = await axios.patch(
          url,
          user,
          // user,
          {
            headers: { Authorization: `Bearer ${token}` }
          })
          window.location.reload(true)
      } catch (e) {
        console.log(e)
      }
    },
    async deleteUser() {
      try {
        console.log("delete user id: " + this.user.id)
        const url = "http://127.0.0.1:3333/api/account/" + this.user.id
        const token = localStorage.getItem('token')
        console.log('token: ' + token)
        await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        navigateTo({ path: '/' })
      } catch (e) {
        console.log(e)
      }
    }
  }
}

</script>
