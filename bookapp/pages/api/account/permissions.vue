<template>
  <div>
    <NavBar />
    <div class="flex justify-center">
      <p class="text-2xl font-bold py-5 w-4/6">List of permissions</p>
      <!-- modal for create permission -->
      <div class="w-1/6 py-5">
        <!-- <button class="rounded-full bg-green-300 hover:bg-green-400 py-1 px-3 float-right" @click="">Add Book</button> -->
        <!-- <UButton class="rounded-full bg-green-500 hover:bg-green-600 py-1 px-3 float-right" label="Add Permission"
          @click="isOpen = true" />

        <UModal v-model="isOpen">
          <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
              <p class="text-2xl font-bold w-4/6">Add new permission</p>
              <p class="text-red-500">User permission record already exist.</p>

            </template>
            <div class="input-container">
              <label for="userId" class="font-semibold mr-3">User ID</label>
              <select id="userId" name="userId" v-model="userId">
                <option v-for="(user, index) in users" :key="index" :value="user.id">{{ user.name }}</option>
              </select>
            </div>

            <div class="form-control">
              <h2 class="font-semibold">Access</h2>
              <div>
                <input id="ADD_PRODUCT" name="accessTypes" type="checkbox" value="ADD_PRODUCT" v-model="accessTypes" />
                <label for="ADD_PRODUCT" class="ml-3">Add Book</label>
              </div>
              <div>
                <input id="DELETE_PRODUCT" name="accessTypes" type="checkbox" value="DELETE_PRODUCT"
                  v-model="accessTypes" />
                <label for="DELETE_PRODUCT" class="ml-3">Delete Book</label>
              </div>
              <div>
                <input id="EDIT_PRODUCT" name="accessTypes" type="checkbox" value="EDIT_PRODUCT" v-model="accessTypes" />
                <label for="EDIT_PRODUCT" class="ml-3">Update Book</label>
              </div>
              <div>
                <input id="EDIT_ORDER" name="accessTypes" type="checkbox" value="EDIT_ORDER" v-model="accessTypes" />
                <label for="EDIT_ORDER" class="ml-3">Update Order</label>
              </div>
              <div>
                <input id="GET_ALL_BOOKS" name="accessTypes" type="checkbox" value="GET_ALL_BOOKS"
                  v-model="accessTypes" />
                <label for="GET_ALL_BOOKS" class="ml-3">View All Books</label>
              </div>
            </div>


            <template #footer>

              <UButton class="rounded-full bg-green-500 hover:bg-green-600 py-1 px-3 float-right ml-2"
                label="Add Permission" @click="createPermission" />
              <UButton class="rounded-full bg-slate-500 hover:bg-slate-600 py-1 px-3 float-right mb-5" label="Cancel"
                @click="isOpen = false" />
            </template>
          </UCard>
        </UModal> -->


      </div>

    </div>

    <!-- table of books -->
    <!-- <div class="flex justify-center">
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
    </div> -->


    <!-- table of books 2 -->
    <div class="flex justify-center">
      <table class="table-auto center w-5/6 bg-slate-300 rounded-lg">
        <thead>
          <tr>
            <th class="py-2">ID</th>
            <th>User</th>
            <th>User Permission</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index" class="border-t-[3px] hover:bg-slate-400"
            @click="updateMode(user.id, user.name)">
            <td class="px-3">{{ user.id }}</td>
            <td class="px-3">{{ user.name }}</td>
            <td class="px-3">
              <ul>
                <li v-for="(p, index) in checkData(user.id)" :key="index">{{ p }}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <UModal v-model="openUpdate">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <!-- <Placeholder class="h-8" /> -->
            <p class="text-2xl font-bold w-4/6">Update permission</p>

          </template>
          <div class="input-container">
            <h2 class="font-semibold text-lg">User ID: <span class="font-bold">{{ updateUser }}</span></h2>
          </div>
          <div class="input-container">
            <h2 class="font-semibold text-sm">Current access:</h2>
            <ul class="list-disc ml-5">
              <li v-for="(p, index) in checkData(updateUserId)" :key="index" class="text-sm">{{ p }}</li>
            </ul>
          </div>
          <!-- checkbox -->
          <div class="form-control">
            <h2 class="font-semibold text-lg mt-5">Access Types</h2>
            <div>
              <input id="ADD_PRODUCT" name="accessTypes" type="checkbox" value="ADD_PRODUCT" v-model="accessTypes" />
              <label for="ADD_PRODUCT" class="ml-3">Add Book</label>
            </div>
            <div>
              <input id="DELETE_PRODUCT" name="accessTypes" type="checkbox" value="DELETE_PRODUCT"
                v-model="accessTypes" />
              <label for="DELETE_PRODUCT" class="ml-3">Delete Book</label>
            </div>
            <div>
              <input id="EDIT_PRODUCT" name="accessTypes" type="checkbox" value="EDIT_PRODUCT" v-model="accessTypes" />
              <label for="EDIT_PRODUCT" class="ml-3">Update Book</label>
            </div>
            <div>
              <input id="EDIT_ORDER" name="accessTypes" type="checkbox" value="EDIT_ORDER" v-model="accessTypes" />
              <label for="EDIT_ORDER" class="ml-3">Update Order</label>
            </div>
            <div>
              <input id="GET_ALL_BOOKS" name="accessTypes" type="checkbox" value="GET_ALL_BOOKS" v-model="accessTypes" />
              <label for="GET_ALL_BOOKS" class="ml-3">View All Books</label>
            </div>
            <div>
              <input id="GET_ALL_ORDERS" name="accessTypes" type="checkbox" value="GET_ALL_ORDERS" v-model="accessTypes" />
              <label for="GET_ALL_ORDERS" class="ml-3">View All Orders</label>
            </div>
          </div>


          <template #footer>

            <UButton class="rounded-full bg-green-500 hover:bg-green-600 py-1 px-3 float-right ml-2"
              label="Update Permission" @click="updatePermission" />
            <UButton class="rounded-full bg-slate-500 hover:bg-slate-600 py-1 px-3 float-right mb-5" label="Cancel"
              @click="closeUpdateMode" />
          </template>
        </UCard>
      </UModal>
    </div>
  </div>
</template>
  
<script>
import NavBar from '../components/layout/NavBar.vue';
import axios from 'axios';


definePageMeta({
  middleware: [
    'authenticated',
    'admin'
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
    accessTypes: [],
    userId: '',
    openUpdate: false,
    updateUser: '',
    updateUserId: ''
  }),
  async mounted() {
    await this.getPermissions()
    await this.getUsers()
  },
  methods: {
    closeUpdateMode() {
      this.openUpdate = false;
      this.updateUser = ''
      this.updateUserId = ''
      this.accessTypes = []
    },
    updateMode(id, name) {
      this.openUpdate = true
      this.updateUser = name
      this.updateUserId = id
    },
    checkData(id) {
      const arr = []
      for (let i = 0; i < this.permissions.length; i++) {
        if (this.permissions[i].user_id === id) {
          arr.push(this.permissions[i].user_permission)
        }
      }
      // this.accessTypes = arr
      return arr
    },
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
    },
    async updatePermission() {
      console.log('updatePermission')
      console.log(this.accessTypes)
      console.log(this.permissions)

      const token = localStorage.getItem('token')
      // get user_permissions id of records with user_id = updateUserId
      const idDelete = []
      for (let i = 0; i < this.permissions.length; i++) {
        if (this.permissions[i].user_id === this.updateUserId) {
          // console.log(this.permissions[i].id)
          idDelete.push(this.permissions[i].id)
          try {
            const url = 'http://127.0.0.1:3333/api/permissions?id=' + this.permissions[i].id
            console.log(url)
            const { data } = await axios.delete(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            })
          } catch (e) {
            console.log(e)
          }
        }
      }
      // create permission records for checkboxes
      console.log('access type length: ', this.accessTypes.length)
      for (let i = 0; i < this.accessTypes.length; i++) {
        const record = {
          userId: this.updateUserId,
          userPermission: this.accessTypes[i]
        }
        console.log('record: ', record)
        try {
          const url = 'http://127.0.0.1:3333/api/permissions'
          const { data } = await axios.post(url, record,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            })
        } catch (e) {
          console.log(e)
        }
      }
      this.accessTypes = []
      this.openUpdate = false
      window.location.reload(true)
    },
  }
}
</script>