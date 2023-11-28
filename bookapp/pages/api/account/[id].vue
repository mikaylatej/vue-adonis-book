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
            <input id="name" v-model="name" :placeholder="user.name" type="text">
          </td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">User Type</td>
          <td class="m-8 text-lg">{{ user.user_type }}</td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Location</td>
          <td class="m-8 text-lg">{{ user.location }}</td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Email</td>
          <td class="m-8 text-lg">{{ user.email }}</td>
        </tr>
      </table>
    </div>

    <div class="flex justify-center">
      <div class="w-5/6 my-5">
        <button v-show="!updateMode" class="rounded-full bg-amber-300 hover:bg-amber-400 px-3 py-1 float-right ml-2"
          @click="updateUser">Update</button>
        <button v-show="updateMode" class="rounded-full bg-green-300 hover:bg-green-400 px-3 py-1 float-right ml-2" @click="saveUpdate">Save
          Changes</button>
        <button class="rounded-full bg-red-300 hover:bg-red-400 px-3 py-1 float-right" @click="deleteUser">Delete Account</button>
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
    name: ''
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

      } catch (e) {
        console.log(e)
        const userId = localStorage.getItem('userId')
        return navigateTo('/api/account/' + userId)
      }
    },
    updateUser() {
      this.updateMode = true
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
        const { data } = await axios.patch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          user: {
            name: this.name,
            // access_type: this.access_type,
            // price: this.price,
            // author: this.author,
            // location: this.location
          }
        })
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
