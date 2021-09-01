<template>
  <div
    class="
      flex
      items-center
      justify-between
      bg-green-50
      p-2
      border-b-2 border-black
    "
  >
    <div class="flex items-center">
      <img src="@/assets/sheet_ban.png" class="ml-10 logo-img" contain />
      <h1 class="pl-2 text-2xl font-bold md:visible invisible">SheetBan</h1>
    </div>
    <div class="flex items-center p-3 google-wrapper" @click="getLoginUrl">
      <GoogleLogo />
      <div class="ml-2">{{ userEmail || "Log in" }}</div>
    </div>
  </div>
</template>

<script>
import GoogleLogo from "@/assets/GoogleLogo.vue";
import Api from "@/services/Api.js";

export default {
  props: {
    userEmail: {
      type: String,
    },
  },

  components: {
    GoogleLogo,
  },

  setup() {
    const getLoginUrl = async () => {
      const { authorizeUrl } = await Api.getGoogleAuthLink();
      window.location.href = authorizeUrl;
    };

    return { getLoginUrl };
  },
};
</script>

<style scoped lang="scss">
.logo-img {
  width: 64px;
  height: 64px;
}

.google-wrapper {
  min-width: 150px;
  height: 50px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 25%);
  background-color: white;
  color: #757575;
  &:hover {
    cursor: pointer;
  }
}
</style>