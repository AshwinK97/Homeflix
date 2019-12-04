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

/**
 * View used to upload video files as a user
 */
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

      // Place file within a FormData object to allow http to transfer file data
      let formData = new FormData();
      formData.append("video", this.videoFile);

      axios
        .post("http://"+this.$serverIP+":3000/upload", formData, {
          headers: {
            // Ensures the form data will be interpreted as file data
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          // If file was uploaded successfully, redirect user to home screen
          this.$router.push("/");
        })
        .catch(err => {
          // Inform user of error via a popup snackbar
          this.snackbar = true;
          this.snackbarText = err;
          console.log(err);
        });
    },
    // Ensure file type is a video
    isFileVideo() {
      if (this.videoFile.type.substring(0, 5) !== "video") {
        this.notVideoError();
      }
    },
    // If non-video file detected, inform user via popup snackbar
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