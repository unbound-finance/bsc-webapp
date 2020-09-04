<template>
  <div class="text-white font-bold rounded-lg">
    <p
      class="text-center mt-10 font-bold text-2xl text-light-primary dark:text-dark-primary"
    >
      unbound
    </p>

    <p class="text-center m-10 text-md text-gray-600 dark:text-dark-primary">
      Restricted Access
    </p>

    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-full px-3 mb-6 md:mb-0">
        <input
          id="grid-first-name"
          v-model="username"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          type="text"
          placeholder="username"
        />

        <input
          id="grid-first-name"
          v-model="password"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          type="password"
          placeholder="password"
        />
        <button
          class="w-full mt-8 bg-light-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          @click="signIn"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'login',
  data() {
    return {
      username: '',
      password: '',
      originalPassword: 'HelloWorld',
    }
  },
  methods: {
    signIn() {
      if (this.password === this.originalPassword) {
        localStorage.setItem('password', this.originalPassword)
        this.$router.push('/')
      } else {
        alert('Enter correct details')
      }
    },
  },
}
</script>
