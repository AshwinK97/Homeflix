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
 * Video view after selecting video from the Library section of the Home page. 
 * Used to initiate video sync up for the future using the video id and user id
 */
export default {
  name: "videoPage",
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
    // Assign data from route params to component data
    this.video.title = this.$route.params.title;
    this.video.id = this.$route.params.id;
    this.userId = this.$userId;

    // Ensure Sync is enabled on the server by passing the userId and videoId
    axios
      .post("http://" + this.$serverIP + ":3000/addSync", {
        user: this.$userId,
        title: this.video.title,
        id: this.video.id
      })
      .then(res => {
        // Enable component level sync to start emitting video time via web sockets
        this.enableSync();
      })
      .catch(err => {
        console.log(err);
      });
  },
  beforeDestroy() {
    // Clear the 2 second interval set to emit the video time
    clearInterval(this.syncFn);

    // Remove Video from the synctable within the server, removes it from the Watching Now section
    axios
      .post("http://" + this.$serverIP + ":3000/removeSync", {
        user: this.$userId,
        id: this.video.id
      })
      .then(res => {
        console.log("Video removed from sync");
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    // Start Sync for current video
    enableSync() {
      // Register interval as a function to manipulate in the future
      this.syncFn = setInterval(() => {
        // Use web sockets to emit video data to SYNC_VIDEO address 
        // Emit user and video id to register on the server
        // Emit current time from the video reference to server
        this.socket.emit("SYNC_VIDEO", {
          user: this.$userId,
          video: this.video.title,
          id: this.video.id,
          time: Math.floor(this.videoElement.currentTime)
        });
      }, 2000);
    }
  },
  data() {
    return {
      video: {
        title: "",
        id: 0
      },
      userId: "",
      socket: io(this.$serverIP + ":3000"),
      syncFn: null
    };
  }
};
</script>
