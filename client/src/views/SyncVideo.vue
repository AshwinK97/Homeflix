<template>
  <div>
    <v-container>
      <v-row>
        <h2>{{ video.title.substring(0, video.title.lastIndexOf("_")).replace(/_/g, " ") }}</h2>
      </v-row>
      <v-row>
        <v-col cols="8">
          <video width="100%" controls autoplay ref="videoPlayer" class="video">
            <source
              :src="'http://'+$serverIP+':3000/video/' + this.$route.params.id"
              type="video/mp4"
            />
          </video>
          <v-switch v-model="syncOn" label="Sync"></v-switch>
        </v-col>
        <v-col cols="4">
          <Chat />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Chat from "@/components/Chat.vue";
import io from "socket.io-client";
import axios from "axios";

/**
 * Video view after selecting video from the Watching Now section of the Home page. 
 * Uses user id and video id stored for the video emitting a sync time to create a sync video stream. 
 * Video will allow for a +/- 4 second drift, and toggle for desyncing from original video stream.
 */
export default {
  name: "syncVideoPage",
  components: {
    Chat
  },
  computed: {
    // Capture a reference to the video tag created by Vue in the DOM
    // Return reference to be used
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

    // Look at the address SYNC_VIDEO_TIME_(userid)_(videoid) for video time to sync to
    this.socket.on(
      "SYNC_VIDEO_TIME_" + this.syncUser + "_" + this.video.id,
      syncTime => {
        // Capture the video time returned and assign it to the current player
        // Allow for a +/- 4 second drift before assigning the sync time
        // Also ensure the syncOn toggle is turned on
        const videoTime = this.videoElement.currentTime;
        if (Math.abs(syncTime - videoTime) > 4 && this.syncOn) {
          this.videoElement.currentTime = syncTime;
        }
      }
    );
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
      socket: io(this.$serverIP + ":3000")
    };
  }
};
</script>
