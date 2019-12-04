<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <p style="margin: 0" v-if="this.$userId !== ''">Logged in as {{this.$userId}}</p>
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
      <User v-if="!this.authenticated" @toggleAuth="toggleAuth" />
      <router-view v-else></router-view>
    </v-content>
  </v-app>
</template>

<script>
import User from "@/components/User.vue";
import axios from "axios";

/**
 * App level component dedicated to rendering full single-page application
 */
export default {
  name: "App",
  components: {
    // Require User component to seperate auth from routed views
    User
  },
  data() {
    return {
      // Authenticated set to false by default
      authenticated: false
    };
  },
  methods: {
    /**
     * Toggle Authentication based on user entry in the User component
     * 
     * @param {string} userId 
     */
    toggleAuth(data) {
      this.$userId = data;
      this.authenticated = true;
    }
  },
  mounted() {
    // Check for previously logged in user, allows to resume session
    if (localStorage.userId) {
      // Ensure user exists in the server by asking isUserHandle route
      axios
        .post("http://" + this.$serverIP + ":3000/isUserHandle", {
          username: localStorage.userId
        })
        .then(res => {
          // User successfully found, allow user to continue with identical handle as before
          this.authenticated = true;
          this.$userId = localStorage.userId;
        })
        .catch(err => {
          // Log any errors received from the server
          console.log(err);
        });
    }
  }
};
</script>

<style>
.link {
  text-decoration: none;
}
</style>
