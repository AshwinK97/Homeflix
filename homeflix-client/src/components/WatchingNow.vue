<template>
  <v-container>
    <v-flex xs12 class="ma-5">
      <h1 class="display-3">Watching Now</h1>
    </v-flex>
    <v-row>
      <v-col cols="12" sm="3" v-for="video in videos" :key="video.id">
        <router-link class="link" :to="{name: 'syncVideo', params: {user: video.user, id: video.videoid, title: video.title }}">
          <v-card min-width="350" min-height="200">
            <v-img src="@/assets/logo.png" height="200"></v-img>
            <v-card-title>
              <h2>{{ video.title }}</h2>
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
  name: "WatchingNow",
  data() {
    return {
      videos: []
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/activeVideos")
      .then(res => {
        console.log(res.data);
        this.videos = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>