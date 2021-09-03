<template>
  <MainLayout :userEmail="userEmail">
    <div class="my-6">
      <p class="mb-3 ml-3">
        Предоставте доступ боту к таблицам:
        <strong>np-bot-278613.iam.gserviceaccount.com</strong>
      </p>
      <DashboardForm :disabled="formDisabled" @addPair="addNewPair" />
    </div>
    <SheetPairList
      :disabled="formDisabled"
      :pairs="pairs"
      @deletePair="filterOutPair"
    />
  </MainLayout>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import Api from "@/services/Api";
import { getUserInfo } from "@/services/GoogleApi";

import MainLayout from "@/components/layout/MainLayout.vue";
import DashboardForm from "./components/DashboardForm.vue";
import SheetPairList from "./components/SheetPairList.vue";

export default {
  components: {
    MainLayout,
    DashboardForm,
    SheetPairList,
  },

  setup() {
    const userEmail = ref("");
    const formDisabled = ref(true);

    const pairs = ref([]);
    const filterOutPair = (id) => {
      pairs.value = pairs.value.filter((item) => item.id !== id);
    };
    const addNewPair = (newPair) => {
      pairs.value.push(newPair);
    };

    onMounted(async () => {
      const route = useRoute();
      const router = useRouter();

      if (route.query?.code) {
        const { accessToken, jwtToken } = await Api.sendGoogleAuth({
          code: route.query?.code,
        });
        Api.setAuthToken(accessToken, jwtToken);

        router.replace({ query: null });
      }

      const { token } = Api.getAuthToken();
      if (token) {
        try {
          const { email } = await getUserInfo(token);
          userEmail.value = email;

          const activePairs = await Api.getAllPairs();
          pairs.value = activePairs.pairs;

          formDisabled.value = false;
        } catch {
          Api.setAuthToken("", "");
        }
      }
    });

    return { userEmail, formDisabled, pairs, filterOutPair, addNewPair };
  },
};
</script>
