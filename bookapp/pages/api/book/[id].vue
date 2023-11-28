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
            <input id="title" v-model="title" :placeholder="book.title" type="text">
          </td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Author</td>
          <td class="m-8 text-lg">{{ book.author }}</td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Price</td>
          <td class="m-8 text-lg">{{ book.price }}</td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">User Type</td>
          <td class="m-8 text-lg">{{ book.access_type }}</td>
        </tr>
        <tr class="border-t-[3px]">
          <td class="m-8 text-lg p-5 font-semibold">Location</td>
          <td class="m-8 text-lg">{{ book.location }}</td>
        </tr>
      </table>
    </div>
    <div class="flex justify-center">
      <div class="w-5/6 my-5">
        <button v-show="!updateMode" class="rounded-full bg-amber-300 hover:bg-amber-400 px-3 py-1 float-right ml-2"
          @click="updateBook">Update</button>
        <button v-show="updateMode" class="rounded-full bg-green-300 hover:bg-green-400 px-3 py-1 float-right ml-2" @click="saveUpdate">Save
          Changes</button>
        <button class="rounded-full bg-red-300 hover:bg-red-400 px-3 py-1 float-right" @click="deleteBook">Delete</button>
      </div>
    </div>
  </div>
</template>
  
  
  
<script>
import NavBar from '../components/layout/NavBar.vue';
import axios from 'axios';

import { useRoute } from 'vue-router';

export default {
  components: {
    NavBar
  },
  data: () => ({
    book: {},
    updateMode: false,
    title: ''
  }),
  async mounted() {
    await this.getBook()
  },
  methods: {
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
      }
    },
    updateBook() {
      this.updateMode = true
    },
    async saveUpdate() {
      try {
        this.updateMode = false
        // const route = useRoute()
        // console.log('route params id: ' + route.params.id)
        console.log("book id: " + this.book.id)
        const url = "http://127.0.0.1:3333/api/books?book_id=" + this.book.id
        const token = localStorage.getItem('token')
        console.log('token: ' + token)
        const { data } = await axios.patch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          book: {
            title: this.title,
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