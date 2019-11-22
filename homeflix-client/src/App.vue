<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">Homeflix</div>
    </v-app-bar>
    <v-content>
      <Auth v-if="!this.authenticated" @toggleAuth="toggleAuth"/>
      <router-view v-else></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Auth from "@/components/Auth.vue";

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
  }
};
</script>

<style>
.link {
  text-decoration: none;
}
</style>
