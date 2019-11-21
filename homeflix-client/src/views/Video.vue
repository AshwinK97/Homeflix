<template>
  <div>
    <v-container>
      <v-row>
        <h2>
          {{ video.title }}
        </h2>
      </v-row>
      <v-row>
        <v-col cols="8">
          <video width="100%" controls ref="videoPlayer" class="video">
            <source :src="'http://localhost:3000/video/' + this.$route.params.id" type="video/mp4" />
          </video>
        </v-col>
        <v-col cols="4">
          <Chat/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn v-on:click="skip">Skip 20secs</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import VideoPlayer from "@/components/VideoPlayer.vue";
// import axios from "axios";

import Chat from '@/components/Chat.vue'

export default {
  name: "videoPage",
  components: {
    Chat
  },
  computed: {
    videoElement() {
      return this.$refs.videoPlayer;
    }
  },
  mounted() {
    console.log(this.videoElement);
  },
  methods: {
    skip() {
      // console.log("skip")
      this.videoElement.currentTime = 20;
    }
  },
  data() {
    return {
      video: {
        title: "Gimme da penta"
      }
    };
  }
};
</script>
