<template>
  <div class="flex flex-col">
    <Header :userEmail="userEmail" />
    <div class="container mx-auto"><slot></slot></div>
  </div>
</template>

<script>
import Header from "./Header.vue";

export default {
  name: "MainLayout",

  props: {
    userEmail: {
      type: String,
    },
  },

  components: {
    Header,
  },
};
</script>