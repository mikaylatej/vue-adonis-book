<template>
  <div>
    <div class="card">
      <h3>Register</h3>
      <div class="input-container">
        <label for="name">Name</label>
        <input id="name" v-model="name" placeholder="Name" type="text" />

        <label for="user-type">User Type</label>
        <select id="user-type" name="user-type" v-model="userType">
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
        </select>


        <label for="location">Location</label>
        <select id="location" name="location" v-model="location">
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Australia">Australia</option>
          <option value="Africa">Africa</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
        </select>

        <label for="email">Email</label>
        <input id="email" v-model="email" placeholder="Email" type="email" />
        <label for="password">Password</label>
        <input id="password" v-model="password" placeholder="Password" type="password" />
      </div>
      <div class="nav-buttons">
        <button class="register-button" @click="handleRegister">Register</button>
        <p class="form-type" @click="login">Already have an account? Login</p>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios'

export default {
  data: () => ({
    // token: {},
    name: '',
    email: '',
    password: '',
    userType: 'Student',
    location: 'Asia'
  }),
  //   async mounted() {
  //     await this.getBooks()
  //   },
  methods: {
    async handleRegister() {
      const user = {
        name: this.name,
        userType: this.userType,
        location: this.location,
        email: this.email,
        password: this.password
      }
      try {
        console.log('register')
        const { data } = await axios.post(
          "http://127.0.0.1:3333/api/auth/register",
          user
        )
        // console.log('data login: ' + data.token)
        // this.token = data.token
        // localStorage.setItem("token", data.token)

        // clear data
        this.name = ''
        this.userType = 'Student'
        this.location = 'Asia'
        this.email = ''
        this.password = ''

        navigateTo({ path: '/' })
      } catch (e) {
        console.log(e)
      }
    },
    login() {
      navigateTo({ path: '/' })
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

.input-container input,
.input-container select {
  margin-bottom: 0.3rem;
  padding: 0.3rem;
  outline: none;
  border: 0.1rem solid rgb(0, 0, 0, 0.1);
  border-radius: 0.2rem;
}

.nav-buttons {
  text-align: center;
}

.register-button {
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