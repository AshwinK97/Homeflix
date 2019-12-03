<template>
  <div>
    <v-container>
      <v-row>
        <h2>
          {{ video.title.substring(0, video.title.lastIndexOf("_")).replace(/_/g, " ") }}
        </h2>
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
    this.video.id = this.$route.params.id;
    this.userId = this.$userId;
    console.log("video "+this.$userId);
    axios
      .post("http://"+this.$serverIP+":3000/addSync", {
        user: this.$userId,
        title: this.video.title,
        id: this.video.id
      })
      .then(res => {
        this.enableSync();
      })
      .catch(err => {
        console.log(err);
      });
  },
  beforeDestroy() {
    clearInterval(this.syncFn);
    axios
      .post("http://"+this.$serverIP+":3000/removeSync", {
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
    skip() {
      this.videoElement.currentTime = 20;
    },
    enableSync() {
      this.syncFn = setInterval(() => {
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
      socket: io(this.$serverIP+":3000"),
      syncFn: null
    };
  }
};
</script>
