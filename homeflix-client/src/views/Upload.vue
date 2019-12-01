<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Upload</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-file-input v-model="videoFile" label="Video Upload" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" v-on:click="uploadVideo">Upload</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "upload",
  data() {
    return {
      videoFile: undefined,
      snackbar: false,
      snackbarText: ""
    };
  },
  methods: {
    uploadVideo() {
      this.isFileVideo();
    },
    isFileVideo() {
      if (this.videoFile.type.substring(0, 5) !== "video") {
        this.notVideoError();
      } else {
        // Axios here
        axios
          .post("http://localhost:3000/upload", {
            video: this.videoFile
          })
          .then()
          .catch(err => {
            this.snackbar = true;
            this.snackbarText = err;
          })
      }
    },
    notVideoError() {
      this.snackbar = true;
      this.snackbarText =
        "File uploaded is not a video, please upload video files only";
    }
  }
};
</script>

<style scoped>
.link {
  font-style: italic;
  font-size: small;
}
</style>