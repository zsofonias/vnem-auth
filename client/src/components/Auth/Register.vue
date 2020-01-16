<template>
  <div class="register">
    <div class="register-form">
      <h2>Register</h2>
      <div class="form" @submit.prevent="register">
        <v-form>
          <v-text-field label="First Name" v-model="firstName" type="text" outlined></v-text-field>
          <p v-if="firstNameError" class="red--text text--darken-4">{{firstNameError}}</p>
          <v-text-field label="Last Name" v-model="lastName" type="text" outlined></v-text-field>
          <p v-if="lastNameError" class="red--text text--darken-4">{{lastNameError}}</p>
          <v-text-field
            label="Email"
            v-model="email"
            type="email"
            placeholder="user@mail.com"
            outlined
          ></v-text-field>
          <p v-if="emailError" class="red--text text--darken-4">{{emailError}}</p>
          <v-text-field
            label="Password"
            v-model="password"
            type="password"
            placeholder="********"
            outlined
          ></v-text-field>
          <p v-if="passwordError" class="red--text text--darken-4">{{passwordError}}</p>
          <v-text-field
            label="Confirm Password"
            v-model="confirmPassword"
            type="password"
            placeholder="********"
            outlined
          ></v-text-field>
          <p v-if="confirmPasswordError" class="red--text text--darken-4">{{confirmPasswordError}}</p>
          <v-layout justify-center>
            <v-btn depressed large color="primary" type="submit">Register</v-btn>
          </v-layout>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      loading: false
    };
  },
  methods: {
    register() {
      this.loading = true;
      this.$store
        .dispatch("register", {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword
        })
        .then(res => {
          this.loading = false;
          this.errors = {};
          console.log(res);
          if (res.success) {
            this.$router.push({
              name: "register-success",
              params: {
                email: this.email
              }
            });
          } else if (!res.success) {
            if (Array.isArray(res.message)) {
              const errMessages = {};
              res.message.forEach(errObj => {
                errMessages[errObj.name] = errObj.message;
              });
              console.log(errMessages);
              this.errors = errMessages;
            } else {
              switch (res.message.value) {
                case this.email:
                  console.log(res.message.message);
                  this.errors["email"] = res.message.message;
                  break;
              }
            }
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    errorConstructor(errKey) {
      let err = null;
      if (this.errors !== null && Object.keys(this.errors).includes(errKey)) {
        err = this.errors[errKey];
      }
      return err;
    }
  },
  computed: {
    firstNameError() {
      this.errorConstructor("firstName");
      return this.errorConstructor("firstName");
    },
    lastNameError() {
      return this.errorConstructor("lastName");
    },
    emailError() {
      return this.errorConstructor("email");
    },
    passwordError() {
      return this.errorConstructor("password");
    },
    confirmPasswordError() {
      return this.errorConstructor("confirmPassword");
    }
  }
};
</script>

<style>
.register .form {
  margin-top: 20px;
}

.register .register-form {
  max-width: 600px;
}
</style>
