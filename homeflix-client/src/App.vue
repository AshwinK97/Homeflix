<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <p style="margin: 0">Logged in as {{this.$userId}}</p>
      </div>
      <v-spacer></v-spacer>
      <router-link to="/">
        <div class="d-flex align-center">
          <h2 style="color: #fff">Homeflix</h2>
        </div>
      </router-link>
      <v-spacer></v-spacer>
      <router-link to="/upload">
        <div class="d-flex align-center">
          <v-btn icon>
            <v-icon>mdi-cloud-upload-outline</v-icon>
          </v-btn>
        </div>
      </router-link>
    </v-app-bar>
    <v-content>
      <Auth v-if="!this.authenticated" @toggleAuth="toggleAuth" />
      <router-view v-else></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Auth from "@/components/Auth.vue";
import axios from 'axios';

export default {
  name: "App",
  components: {
    Auth
  },
  data() {
    return {
      authenticated: true
    };
  },
  methods: {
    toggleAuth(data) {
      this.$userId = data;
      this.authenticated = true;

      console.log(this.$userId);
    }
  },
  beforeDestroy() {
    console.log("App is being destroyed")
  }
};
</script>

<style>
.link {
  text-decoration: none;
}
</style>
