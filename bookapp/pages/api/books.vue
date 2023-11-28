<template>
  <div>
    <NavBar />
    <div class="flex justify-center">
      <p class="text-2xl font-bold py-5 w-4/6">List of books</p>

      <!-- modal for create book -->
      <div class="w-1/6 py-5">
        <!-- <button class="rounded-full bg-green-300 hover:bg-green-400 py-1 px-3 float-right" @click="">Add Book</button> -->
        <UButton class="rounded-full bg-green-500 hover:bg-green-600 py-1 px-3 float-right" label="Add Book"
          @click="isOpen = true" />

        <UModal v-model="isOpen">
          <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
              <!-- <Placeholder class="h-8" /> -->
              <p class="text-2xl font-bold w-4/6">Add new book</p>
            </template>
            <div class="input-container">
              <label for="title" class="font-semibold">Title</label>
              <input id="title" v-model="title" placeholder="Title" type="text" />

              <label for="author" class="font-semibold">Author</label>
              <input id="author" v-model="author" placeholder="Author" type="text" />

              <label for="price" class="font-semibold">Price</label>
              <input id="price" v-model="price" placeholder="Price" type="number" />

              <label for="user-type" class="font-semibold">User Type</label>
              <!-- <select id="user-type" name="user-type" v-model="userType">
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">All</option>
              </select> -->
              <div>
                <input id="user-student" name="user-type" type="radio" value="Student" v-model="access_type" />
                <label for="user-student" class="px-3">Student</label>
              </div>
              <div>
                <input id="user-teacher" name="user-type" type="radio" value="Teacher" v-model="access_type" />
                <label for="user-teacher" class="px-3">Teacher</label>
              </div>
              <div>
                <input id="user-all" name="user-type" type="radio" value="All" v-model="access_type" />
                <label for="user-all" class="px-3">All</label>
              </div>

              <label for="location">Location</label>
              <select id="location" name="location" v-model="location">
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Australia">Australia</option>
                <option value="Africa">Africa</option>
                <option value="North America">North America</option>
                <option value="South America">South America</option>
              </select>
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
            <th class="py-2">Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>User Type</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in books" :key="index" class="border-t-[3px] hover:bg-slate-400"
            @click="viewBook(book.id)">
            <td class="px-3">{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.price }}</td>
            <td>{{ book.access_type }}</td>
            <td class="px-3">{{ book.location }}</td>
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
    books: {},
    isOpen: false,
    title: '',
    author: '',
    price: '',
    access_type: null,
    location: 'Asia'
  }),
  async mounted() {
    console.log('mounted')
    await this.getBooks()
    await this.getUser()
  },
  methods: {
    async getBooks() {
      try {
        console.log('user token: ' + localStorage.getItem('token'))

        const url = "http://127.0.0.1:3333/api/books"
        const token = localStorage.getItem('token')

        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.books = data

      } catch (e) {
        console.log(e)
      }
    },
    async getUser() {
      try {
        // store login user id to localstorage
        console.log('user token: ' + localStorage.getItem('token'))
        // const route = useRoute()
        const url = "http://127.0.0.1:3333/api/account/"
        const token = localStorage.getItem('token')
        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log("user id: ", data.id)
        localStorage.setItem("userId", data.id)
        localStorage.setItem("userType", data.user_type)

      } catch (e) {
        console.log(e)
      }
    },
    viewBook(id) {
      console.log("clicked id: " + id)
      const path = '/api/book/' + id
      navigateTo({ path: path })
    },
    async createBook() {
      const book = {
        title: this.title,
        author: this.author,
        price: this.price,
        access_type: this.access_type,
        location: this.location,
      }
      try {
        console.log(book)

        const url = 'http://127.0.0.1:3333/api/books'
        const token = localStorage.getItem('token')
        const { data } = await axios.post(url, book,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })

        // clear data
        this.title = ''
        this.author = ''
        this.location = 'Asia'
        this.price = ''
        this.access_type = null

        this.isOpen = false
        navigateTo({ path: '/' })
      } catch (e) {
        console.log(e)
      }
    }
  },
};

</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
}

.input-container input,
.input-container select {
  margin-bottom: 0.3rem;
  padding: 0.3rem;
  outline: none;
  border: 0.1rem solid rgb(0, 0, 0, 0.1);
  border-radius: 0.2rem;
}
</style>