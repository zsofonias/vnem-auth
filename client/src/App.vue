<template>
  <v-app>
    <!-- <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar> -->
    <AppBar />

    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AppBar from './components/layout/AppBar';

export default {
  name: 'App',

  components: {
    AppBar
  },

  data: () => ({
    //
  })
};
</script>
