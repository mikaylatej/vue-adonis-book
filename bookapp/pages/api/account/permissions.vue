<template>
  <div>
    <NavBar />
    <div class="flex justify-center">
      <p class="text-2xl font-bold py-5 w-4/6">List of permissions</p>

      <!-- modal for create permission -->
      <div class="w-1/6 py-5">
        <!-- <button class="rounded-full bg-green-300 hover:bg-green-400 py-1 px-3 float-right" @click="">Add Book</button> -->
        <UButton class="rounded-full bg-green-500 hover:bg-green-600 py-1 px-3 float-right" label="Add Permission"
          @click="isOpen = true" />

        <UModal v-model="isOpen">
          <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
              <!-- <Placeholder class="h-8" /> -->
              <p class="text-2xl font-bold w-4/6">Add new permission</p>
            </template>
            <div class="input-container">
              <label for="userId" class="font-semibold mr-3">User ID</label>
              <select id="userId" name="userId" v-model="userId">
                <option v-for="(user, index) in users" :key="index" :value="user.id">{{ user.name }}</option>
              </select>
            </div>

            <!-- checkbox -->
            <div class="form-control">
              <h2>Access</h2>
              <div v-for="(access, index) in types" :key="index" >
                <input :id="access.code" name="accessTypes" type="checkbox" :value="access.code" v-model="interest" />
                <label :for="access.code">{{ access.code }}</label>
                <!-- create route to get all access types from permissions table -->
              </div>
            </div>


            <template #footer>

              <UButton class="rounded-full bg-green-500 hover:bg-green-600 py-1 px-3 float-right ml-2" label="Add Book"
                @click="createBook" />
              <UButton class="rounded-full bg-slate-500 hover:bg-slate-600 py-1 px-3 float-right mb-5" label="Cancel"
                @click="isOpen = false" />
            </template>
          </UCard>
        </UModal>
      </div>

    </div>

    <!-- table of books -->
    <div class="flex justify-center">
      <table class="table-auto center w-5/6 bg-slate-300 rounded-lg">
        <thead>
          <tr>
            <th class="py-2">User ID</th>
            <th>User Permission</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(permission, index) in permissions" :key="index" class="border-t-[3px] hover:bg-slate-400">
            <td class="px-3">{{ permission.user_id }}</td>
            <td class="px-3">{{ permission.user_permission }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script>
import NavBar from '../components/layout/NavBar.vue';
import axios from 'axios';


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
    permissions: {},
    users: {},
    isOpen: false,
    accessTypes: []
  }),
  async mounted() {
    await this.getPermissions()
    await this.getUsers()
  },
  methods: {
    async getPermissions() {
      try {
        console.log('user token: ' + localStorage.getItem('token'))

        const url = "http://127.0.0.1:3333/api/permissions"
        const token = localStorage.getItem('token')

        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.permissions = data

      } catch (e) {
        console.log(e)
      }
    },
    async getUsers() {
      try {
        console.log('user token: ' + localStorage.getItem('token'))

        const url = "http://127.0.0.1:3333/api/permissions/users"
        const token = localStorage.getItem('token')

        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.users = data

      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>