<template>
  <div class="lightbox">
    <img :src="videoUrl(video.image)" />
    <div class="lightbox-info">
      <div class="lightbox-info-inner">
        <p v-if="video.title">{{ video.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import videos from "@/data/videos.json";

export default {
  name: "Video",
  data() {
    return {
      videos
    };
  },
  computed: {
    video() {
      return this.videos.find(video => {
        return video.index === Number(this.$route.params.id);
      });
    }
  },
  methods: {
    videoUrl(filename) {
      return require(`../assets/images/${filename}`);
    }
  }
};
</script>

<style>
.lightbox {
  position: relative;
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
}
.lightbox img {
  margin: auto;
  width: 100%;
  grid-column-start: 1;
  grid-column-end: 3;
}
.lightbox-info {
  margin: auto 2rem auto 0;
  grid-column-start: 2;
}
.lightbox-info-inner {
  background-color: #ffffff;
  display: inline-block;
  padding: 2rem;
}
</style>