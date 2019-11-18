<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">Homeflix</div>
    </v-app-bar>

    <v-content>
      <router-view ></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
  .link {
    text-decoration: none;
  }
</style>
