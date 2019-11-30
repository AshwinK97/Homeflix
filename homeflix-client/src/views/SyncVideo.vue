<template>
  <div>
    <v-container>
      <v-row>
        <h2>{{ video.title }}</h2>
      </v-row>
      <v-row>
        <v-col cols="8">
          <video width="100%" controls autoplay ref="videoPlayer" class="video">
            <source :src="'http://localhost:3000/video/' + this.$route.params.id" type="video/mp4" />
          </video>
          <v-switch v-model="syncOn" label="Sync"></v-switch>
        </v-col>
        <v-col cols="4">
          <Chat />
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col cols="12">
        </v-col>
      </v-row>-->
    </v-container>
  </div>
</template>

<script>
import Chat from "@/components/Chat.vue";
import io from "socket.io-client";
import axios from "axios";

export default {
  name: "syncVideoPage",
  components: {
    Chat
  },
  computed: {
    videoElement() {
      return this.$refs.videoPlayer;
    }
  },
  mounted() {
    this.video.title = this.$route.params.title;
    this.video.id = this.$route.params.id;
    this.syncUser = this.$route.params.user;
    this.syncOn = true;
    this.userId = this.$userId;

    this.socket.on("SYNC_VIDEO_TIME_" + this.syncUser + "_" + this.video.id, syncTime => {
      const videoTime = this.videoElement.currentTime;

      if (Math.abs(syncTime - videoTime) > 4 && this.syncOn) {
        this.videoElement.currentTime = syncTime;
      }
    });
  },
  methods: {
    skip() {
      this.videoElement.currentTime = 20;
    }
  },
  data() {
    return {
      video: {
        title: "",
        id: 0
      },
      userId: "",
      syncUser: "",
      syncOn: true,
      socket: io("localhost:3000")
    };
  }
};
</script>
