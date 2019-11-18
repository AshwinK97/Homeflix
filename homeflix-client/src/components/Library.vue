<template>
  <div id="library">{{videos}}</div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      videos: []
    };
  },
  mounted() {
    axios.get("http://localhost:3000/videos").then(response => {
      // eslint-disable-line no-console
      console.log(response);
      this.videos = response;
    });
  }
};
</script>

<style>
</style>