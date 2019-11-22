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
import Chat from '@/components/Chat.vue'
import io from "socket.io-client";
import axios from "axios";

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
    this.video.title = this.$route.params.title;
    this.userId = this.$userId;

    axios
      .post("http://localhost:3000/addSync", {
        user: this.$userId,
        title: this.video.title
      })
      .then(res => {

        this.enableSync();
      })
      .catch(err => {
        console.log(err);
      })
  },
  beforeDestroy() {
    clearInterval(this.syncFn);
  },
  methods: {
    skip() {
      this.videoElement.currentTime = 20;
    },
    enableSync() {
      this.syncFn = setInterval(() => {
        this.socket.emit("SYNC_VIDEO", {
          user: this.userId,
          video: this.video.title,
          time: Math.floor(this.videoElement.currentTime)
        })
      }, 2000);
    }
  },
  data() {
    return {
      video: {
        title: ""
      },
      userId: "",
      socket: io("localhost:3000"),
      syncFn: null
    };
  }
};
</script>
