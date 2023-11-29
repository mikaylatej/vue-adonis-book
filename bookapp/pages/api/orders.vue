<template>
  <div>
    <NavBar />
    <div class="flex justify-center">
      <p class="text-2xl font-bold py-5 w-5/6">List of orders</p>
    </div>
    <!-- table of books -->
    <div class="flex justify-center">
      <table class="table-auto center w-5/6 bg-slate-300 rounded-lg">
        <thead>
          <tr>
            <th class="py-2">User</th>
            <th>Book Title</th>
            <th>Address</th>
            <th>Contact Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="index" class="border-t-[3px] hover:bg-slate-400"
            @click=";">
            <td class="px-3">{{ order.user.name }}</td>
            <td>{{ order.book.title }}</td>
            <td>{{ order.address }}</td>
            <td>{{ order.contact_number }}</td>
            <td class="px-3">{{ order.status }}</td>
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
  async mounted() {
    await this.getOrders()
  },
  data: () => ({
    orders: {},
  }),
  methods: {
    async getOrders() {
      try {
        console.log('user token: ' + localStorage.getItem('token'))

        const url = "http://127.0.0.1:3333/api/orders"
        const token = localStorage.getItem('token')

        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.orders = data
      } catch (e) {
        console.log(e)
      }
    },
  }
}
</script>