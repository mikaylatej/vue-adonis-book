<template>
  <div>
    <div class="card">
      <h3>Login</h3>
      <div class="input-container">
        <label for="email">Email</label>
        <input id="email" v-model="email" placeholder="Email" type="email" />
        <label for="password">Password</label>
        <input id="password" v-model="password" placeholder="Password" type="password" />
        <p v-if="invalidUser" class="text-sm text-red-500">We couldn't verify your credentials.</p>
      </div>
      <div class="nav-buttons">
        <button class="login-button" @click="handleLogin">Login</button>
        <p class="form-type" @click="register">Register</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import { useRoute } from 'vue-router';

// definePageMeta({
//   middleware: [
//     'noToken',
//   ],
// });

export default {
  data: () => ({
    token: {},
    email: '',
    password: '',
    invalidUser: false
  }),
  async beforeMount() {
    const token = localStorage.getItem('token')
    console.log('beforeMount token: ', token)
    if (token !=='undefined' || token !== null) {
      return navigateTo('/api/books')
    }
  },
  async mounted() {
    const route = useRoute()
    console.log('route name: ' + route.name)
  },
  methods: {
    async handleLogin() {
      const user = {
        email: this.email,
        password: this.password
      }
      try {
        const { data } = await axios.post(
          "http://127.0.0.1:3333/api/auth/login",
          user
        )

        console.log('data login: ' + data.token)
        this.token = data.token
        localStorage.setItem("token", data.token)
        this.email = ''
        this.password = ''
        this.invalidUser = false
        navigateTo({ path: '/api/books' })
      } catch (e) {
        console.log(e)
        this.invalidUser = true
      }
    },
    register() {
      navigateTo({ path: '/register' })
      return
    }
  },
};
</script>


<style scoped>
.card {
  padding: 1rem;
  width: 25rem;
  border: 0.1rem solid rgb(0, 0, 0, 0.1);
  border-radius: 0.2rem;
}

label {
  width: 100%;
  display: block;
}

.card h3 {
  font-size: 1.75rem;
}

.input-container {
  display: flex;
  flex-direction: column;
}

.input-container input {
  margin-bottom: 0.3rem;
  padding: 0.3rem;
  outline: none;
  border: 0.1rem solid rgb(0, 0, 0, 0.1);
  border-radius: 0.2rem;
}

.nav-buttons {
  text-align: center;
}

.login-button {
  border: 0.1rem solid rgb(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  padding: 0.3rem;
  margin-top: 1rem;
}

.form-type {
  color: rgb(0, 119, 255);
  font-size: 0.75rem;
  cursor: pointer;
  margin-top: 0.75rem;
}
</style>