<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12 class="ma-5">
        <h1 class="display-3">Being Watched Now</h1>
      </v-flex>
      <v-flex class="mx-5" xs3 v-for="video in videos" :key="video.id">
        <router-link class="link" :to="'/video/' + video.id">
          <v-card min-width="350" min-height="200">
            <v-img :src="video.thumbnail" height="200"></v-img>
            <v-card-title>
              <h2>{{ video.name }}</h2>
            </v-card-title>
          </v-card>
        </router-link>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "WatchingNow",
  data: () => {
    return {
      videos: [
        {
          id: 0,
          name: "Video 1",
          thumbnail: "../assets/logo.png"
        },
        {
          id: 1,
          name: "Video 2",
          thumbnail: "../assets/logo.png"
        }
      ]
    };
  }
};
</script>