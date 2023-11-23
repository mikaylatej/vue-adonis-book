<template>
  <div>
    <h1>list of books</h1>
    <ul>
      <li v-for="(book, index) in books" :key="index">{{ book.title }}</li>
    </ul>
  </div>
</template>



<script>
import axios from 'axios'

export default {
  data: () => ({
    books: {}
  }), 
  async mounted() {
    // const { $api } = useNuxtApp()
    // const { user: user } = await useFetch($api('/auth'), { credentials: 'include' })
    await this.getBooks()
  },
  methods: {
    async getBooks() {
      try {
        console.log('user token: ' + localStorage.getItem('token'))
        const { data } = await axios.get(
          "http://127.0.0.1:3333/api/books", {} , {
          token: localStorage.getItem('token') 
          })
        this.books = data

      } catch (e) {
        console.log(e)
      }
    },

  },
};
</script>