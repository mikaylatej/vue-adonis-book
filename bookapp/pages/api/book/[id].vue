<template>
  <div>
    <NavBar />
    <div class="flex justify-center">
      <p class="text-2xl font-bold py-5 w-5/6">Details of {{ book.title }}</p>
    </div>

    <div class="flex justify-center">
      <table class="table-auto center w-5/6 bg-slate-300 rounded-lg">
        <colgroup>
          <col span="1" style="width: 25%;">
          <col span="1" style="width: 75%;">
        </colgroup>
        <tr class="border-b-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Title</td>
          <td v-if="!updateMode" class="m-8 text-lg">{{ book.title }}</td>
          <td v-else class="m-8 text-lg">
            <input id="title" v-model="book.title" type="text">
          </td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Author</td>
          <td v-if="!updateMode" class="m-8 text-lg">{{ book.author }}</td>
          <td v-else class="m-8 text-lg">
            <input id="author" v-model="book.author" type="text">
          </td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Price</td>
          <td v-if="!updateMode" class="m-8 text-lg">{{ book.price }}</td>
          <td v-else class="m-8 text-lg">
            <input id="price" v-model="book.price" type="text">
          </td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">User Type</td>
          <!-- <td class="m-8 text-lg">{{ book.access_type }}</td> -->

          <td v-if="!updateMode" class="m-8 text-lg">{{ book.access_type }}</td>
          <td v-else class="m-8 text-lg">
            <!-- <input id="accessType" v-model="book.access_type" type="text"> -->
            <select id="accessType" name="accessType" v-model="book.access_type">
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="All">All</option>
            </select>
          </td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Location</td>
          <!-- <td class="m-8 text-lg">{{ book.location }}</td> -->

          <td v-if="!updateMode" class="m-8 text-lg">{{ book.location }}</td>
          <td v-else class="m-8 text-lg">
            <!-- <input id="location" v-model="location" :placeholder="book.location" type="text"> -->
            <select id="location" name="location" v-model="book.location">
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Australia">Australia</option>
              <option value="Africa">Africa</option>
              <option value="North America">North America</option>
              <option value="South America">South America</option>
            </select>
          </td>
        </tr>
      </table>
    </div>
    <div class="flex justify-center">
      <div class="w-5/6 my-5">
        <div v-if="!hideUpdate">
          <button v-show="!updateMode" class="rounded-full bg-amber-300 hover:bg-amber-400 px-3 py-1 float-right ml-2"
            @click="updateBook">Update</button>
          <button v-show="updateMode" class="rounded-full bg-green-300 hover:bg-green-400 px-3 py-1 float-right ml-2"
            @click="saveUpdate">Save
            Changes</button>
          <button v-show="updateMode" class="rounded-full bg-slate-300 hover:bg-slate-400 px-3 py-1 float-right ml-2"
            @click="cancelUpdate">Cancel
            Changes</button>
        </div>
        <button class="rounded-full bg-red-300 hover:bg-red-400 px-3 py-1 float-right" @click="deleteBook">Delete</button>
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
    book: {},
    updateMode: false,
    hideUpdate: true,
    // title: '',
    // author: '',
    // price: '',
    // location: '',
    // accessType: ''
  }),
  async mounted() {
    await this.getBook()
    await this.validateUser()
  },
  methods: {
    async validateUser() {
      try {
        const url = "http://127.0.0.1:3333/api/books?book_id=" + this.book.id
        const token = localStorage.getItem('token')
        const { data } = await axios.patch(
          url,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          })
        this.hideUpdate = false
        console.log('hideUpdate: ' + this.hideUpdate)
      } catch (e) {
        console.log(e)
      }
    },
    async getBook() {
      try {
        console.log('user token: ' + localStorage.getItem('token'))
        const route = useRoute()
        // console.log('route name: ' + route.name)
        // console.log('route params id: ' + route.params.id)
        const url = "http://127.0.0.1:3333/api/books/" + route.params.id
        const token = localStorage.getItem('token')
        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.book = data

      } catch (e) {
        console.log(e)
        return navigateTo('/api/unauthorized')
      }
    },
    updateBook() {
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
        console.log("book id: " + this.book.id)
        const url = "http://127.0.0.1:3333/api/books?book_id=" + this.book.id
        const token = localStorage.getItem('token')
        console.log('this.book: ', this.book)
        const { data } = await axios.patch(
          url,
          this.book,
          {
            headers: { Authorization: `Bearer ${token}` }
          })
        // navigateTo({ path: '/api/book/' + this.book.id })
        // window.location.reload(true)
        // this.$forceUpdate();
      } catch (e) {
        console.log(e)
      }
    },
    async deleteBook() {
      try {
        console.log("delete book id: " + this.book.id)
        const url = "http://127.0.0.1:3333/api/books?book_id=" + this.book.id
        const token = localStorage.getItem('token')
        console.log('token: ' + token)
        const { data } = await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        navigateTo({ path: '/api/books' })
      } catch (e) {
        console.log(e)
      }
    }
  },
};

</script>
  
<style scoped></style>