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
import axios from 'axios';

export default {
  name: "App",
  components: {
    User
  },
  data() {
    return {
      authenticated: false
    };
  },
  methods: {
    toggleAuth(data) {
      this.$userId = data;
      this.authenticated = true;
    }
  },
  mounted() {
    console.log(localStorage.userId);
    if(localStorage.userId) {
      axios
        .post("http://"+ this.$serverIP +":3000/isUserHandle", {
          username: localStorage.userId
        })
        .then(res => {
          this.authenticated = true;
          this.$userId = localStorage.userId;
        })
        .catch(err => {
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
