<template>
  <v-app>
    <AppBar />

    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AppBar from "./components/layout/AppBar";

export default {
  name: "App",

  components: {
    AppBar
  },

  data: () => ({
    //
  })
};
</script>
