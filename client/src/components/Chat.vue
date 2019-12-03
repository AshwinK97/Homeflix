<template>
  <div>
    <v-container class="chat-container" lg="3">
      <v-row>
        <v-col>
          <h3>{{this.chatId.substring(0, this.chatId.lastIndexOf("_")).replace(/_/g, " ")}} Chat Group</h3>
          <hr />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="messages">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{own: message.owner}"
          >{{message.user}}: {{message.message}}</div>
        </v-col>
      </v-row>
      <v-row align="center" class="chat-footer">
        <v-col sm="10">
          <v-text-field @keyup.enter="sendMessage" v-model="message" label="Message" required></v-text-field>
        </v-col>
        <v-col sm="2">
          <v-btn v-on:click="sendMessage">Send</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import io from "socket.io-client";
import { uuid } from "vue-uuid";

export default {
  data() {
    return {
      user: "",
      chatId: undefined,
      message: "",
      messages: [],
      socket: io(this.$serverIP + ":3000")
    };
  },
  methods: {
    sendMessage(e) {
      e.preventDefault();

      this.socket.emit("SEND_MESSAGE", {
        user: this.user,
        message: this.message,
        id: uuid.v1(),
        chatId: this.chatId
      });
      this.message = "";
    },
    isOwner(user) {
      return user === this.user;
    },
    saveHandle() {
      this.isUserEmpty = false;
    }
  },
  mounted() {
    this.user = this.$userId;
    this.chatId = this.$route.params.title;

    this.socket.on("MESSAGE_" + this.chatId, data => {
      data.owner = this.isOwner(data.user);
      this.messages = [...this.messages, data];
      // you can also do this.messages.push(data)
    });
  }
};
</script>

<style scoped>
.chat-container {
  border: 1px #ccc solid;
  border-radius: 0.2rem;
  background-color: #fff;
  /* padding: 10px 20px; */
  padding-bottom: 0;
}

.chat-footer {
  background: #fafafa;
  border-top: 1px #ccc solid;
}

.messages {
  height: 450px;
}

.message {
  width: 75%;
  float: left;
  height: auto;
  border-radius: 0.43em;
  color: white;
  padding: 8px;
  margin: 12px 0;
  background: skyblue;
}

.own {
  float: right;
  background: lightcoral;
}
</style>