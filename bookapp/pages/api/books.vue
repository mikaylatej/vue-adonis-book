<template>
  <div>
    <NavBar />
    <div class="flex justify-center">
      <p class="text-2xl font-bold py-5 w-5/6">List of books</p>
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
  // middleware: ['authenticated'],
  components: {
    NavBar
  },
  data: () => ({
    books: {}
  }),
  // async beforeMount() {
  //   const token = localStorage.getItem('token')
  //   if (token === 'undefined') {
  //     navigateTo({ path: '/' })
  //   }
  // },
  async mounted() {
    console.log('mounted')
    await this.getBooks()
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
    viewBook(id) {
      console.log("clicked id: " + id)
      const path = '/api/book/' + id
      navigateTo({ path: path })
    }
  },
};

</script>
