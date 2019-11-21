<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title v-if="this.isSignup">Signup form</v-toolbar-title>
            <v-toolbar-title v-else>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="userId" label="Login" prepend-icon="person" type="text" />
              <v-text-field
                v-model="password"
                label="Password"
                prepend-icon="lock"
                type="password"
              />
              <v-text-field
                v-if="this.isSignup"
                v-model="checkPassword"
                label="Re-enter Password"
                prepend-icon="lock"
                type="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions v-if="this.isSignup">
            <a class="link" @click.prevent="isSignup = false">Go back to Login</a>
            <v-spacer />
            <v-btn color="primary" v-on:click="authSignup">Signup</v-btn>
          </v-card-actions>
          <v-card-actions v-else>
            <a class="link" @click.prevent="isSignup = true">First time? Click here to sign up here!</a>
            <v-spacer />
            <v-btn color="primary" v-on:click="authLogin">Login</v-btn>
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
  name: "auth",
  data() {
    return {
      userId: "",
      password: "",
      checkPassword: "",
      isSignup: false,
      snackbar: false,
      snackbarText: ""
    };
  },
  methods: {
    authLogin() {
      axios
        .post("http://localhost:3000/login", {
          username: this.userId,
          password: this.password
        })
        .then(res => {
          this.snackbarText = "Login Successful! Redirecting to home page";
          this.snackbar = true;
          this.$emit("toggleAuth", this.userId);
        })
        .catch(err => {
          this.snackbarText = "Error! " + err;
          this.snackbar = true;
        });
    },
    authSignup() {
      if (this.password !== this.checkPassword) {
        this.snackbarText = "Passwords do not match!";
        this.snackbar = true;
      }

      axios
        .post("http://localhost:3000/signup", {
          username: this.userId,
          password: this.password
        })
        .then(res => {
          this.snackbarText = "Signup Successful!";
          this.snackbar = true;
          this.isSignup = false;
        })
        .catch(err => {
          this.snackbarText = "Error!";
          this.snackbar = true;
        });
    },
    validate() {
      if (this.password === "" || this.userId === "") {
        this.snackbarText = "User or Password was not entered!";
        this.snackbar = true;
      }
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