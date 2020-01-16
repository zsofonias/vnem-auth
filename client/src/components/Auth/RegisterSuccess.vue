<template>
  <div class="register-success mt-5">
    <h1>Registration Successful</h1>
    <div class="message-container mt-5 blue-grey white--text">
      <p>
        Account created successfully!
        Account Activation link sent to:
        <span
          class="font-weight-bold lime--text"
        >{{email}}</span>
        Activate your email to fully use our platform.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterSuccess",
  props: ["email"]
};
</script>

<style>
.register-success .message-container {
  border-radius: 10px;
  text-align: center;
}
</style>