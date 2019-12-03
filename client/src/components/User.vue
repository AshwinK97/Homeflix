<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>User Handle form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="userId" label="User Handle" prepend-icon="person" type="text" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" v-on:click="addUser">Submit</v-btn>
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
import router from "@vue/cli-plugin-router";

export default {
  name: "user",
  data() {
    return {
      userId: "",
      snackbar: false,
      snackbarText: ""
    };
  },
  methods: {
    addUser() {
      axios
        .post("http://"+ this.$serverIP +":3000/addUserHandle", {
          username: this.userId
        })
        .then(res => {
          this.snackbarText = "Login Successful! Redirecting to home page";
          this.snackbar = true;
          localStorage.userId = this.userId;
          this.$emit("toggleAuth", this.userId);
        })
        .catch(err => {
          this.snackbarText = "Error! " + err;
          this.snackbar = true;
        });
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