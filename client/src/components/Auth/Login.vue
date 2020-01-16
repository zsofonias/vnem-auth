<template>
  <div class="login">
    <div class="login-form">
      <h2>Login</h2>
      <div class="form">
        <v-form @submit.prevent="login">
          <v-text-field
            label="Email"
            v-model="email"
            type="email"
            placeholder="user@mail.com"
            outlined
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            type="password"
            placeholder="********"
            outlined
          ></v-text-field>
          <p v-if="feedback">{{feedback}}</p>
          <v-layout justify-center>
            <v-btn depressed large color="primary" type="submit">Login</v-btn>
          </v-layout>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      feedback: ""
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        this.$store
          .dispatch("login", {
            email: this.email,
            password: this.password
          })
          .then(res => {
            if (!res.success) {
              this.feedback = res.message;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.feedback = "All Fields are required";
      }
    }
  }
};
</script>

<style>
.login .form {
  margin-top: 20px;
}

.login .login-form {
  max-width: 600px;
}
</style>
