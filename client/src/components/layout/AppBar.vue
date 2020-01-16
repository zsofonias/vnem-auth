<template>
  <div class="app-bar">
    <v-app-bar flat class="primary white--text" light>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

      <v-toolbar-title>
        <router-link class="toolbar-title" :to="{ name: 'index' }">VNEM-AUTH</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!--logged out links  -->
      <v-toolbar-items v-if="!isLoggedIn">
        <v-btn text :to="{ name: 'login' }" color="white">login</v-btn>
        <v-btn text :to="{ name: 'register' }" color="white">register</v-btn>
      </v-toolbar-items>
      <!--logged out links  -->

      <!--logged in links  -->
      <v-toolbar-items v-if="isLoggedIn">
        <v-btn text :to="{ name: 'profile' }" color="white">dashboard</v-btn>
        <!-- <v-btn icon class="white--text">
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
        </v-btn>-->

        <v-menu left bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" class="white--text">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <!-- <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
            </v-list-item>-->
            <v-list-item>
              <v-list-item-title class="list-item-title">Profile</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="list-item-title">Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AppBar",
  computed: {
    ...mapGetters(["isLoggedIn"])
  }
};
</script>

<style>
.app-bar .toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
.app-bar .list-item-title:hover {
  cursor: pointer;
}
</style>
