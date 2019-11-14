<template>
  <div class="wrapper">
    <span class="heading">Videos Available</span>
    <div class="gallery">
      <div class="gallery-panel" v-for="video in videos" :key="video.id">
        <router-link :to="`/video/${video.index}`">
          <img :src="thumbUrl(video.image)" />
        </router-link>
        <span class="title">{{video.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import videos from "@/data/videos.json";

export default {
  name: "Gallery",
  data() {
    return {
      videos
    };
  },
  methods: {
    thumbUrl(filename) {
      return require(`../assets/images/${filename}`);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Armata&display=swap");
@import url('https://fonts.googleapis.com/css?family=Armata|Titillium+Web&display=swap');

.wrapper {
  background-color: #f8f8f8;
  text-align: center;
}
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-gap: 1rem;
  max-width: 80rem;
  margin: 5rem auto;
  padding: 0 5rem;
}
.gallery-panel img {
  width: 100%;
  height: 22vw;
  object-fit: cover;
  border-radius: 0.75rem;
}
.title {
  font-family: "Armata";
}
.heading {
  font-family: 'Titillium Web';
  font-size: 36px;
  margin: auto;
}
</style>