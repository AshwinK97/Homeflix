<template>
  <v-container>
    <v-flex xs12 class="ma-5">
      <h1 class="display-3">Library</h1>
    </v-flex>
    <v-row>
      <v-col cols="12" sm="3" v-for="video in videos" :key="video.id">
        <router-link class="link" :to="{name: 'video', params: {id: video.id, title: video.name }}">
          <v-card min-width="350" min-height="200">
            <v-img :src="'http://' + $serverIP + ':3000/' + video.name + '.jpeg'" height="200"></v-img>
            <v-card-title>
              <h2>{{ video.name.substring(0, video.name.lastIndexOf("_")).replace(/_/g, " ") }}</h2>
            </v-card-title>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Library",
  data() {
    return {
      videos: []
    };
  },
  mounted() {
    axios
      .get("http://" + this.$serverIP + ":3000/videos")
      .then(res => {
        this.videos = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>