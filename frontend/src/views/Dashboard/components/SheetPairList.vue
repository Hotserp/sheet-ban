<template>
  <div class="flex flex-col">
    <SheetPair
      v-for="pair in pairs"
      :key="pair.id"
      :pair="pair"
      :disabled="disabled"
      @deletePair="deletePair"
    />
  </div>
</template>

<script>
import SheetPair from "./SheetPair.vue";

export default {
  components: { SheetPair },
  props: {
    pairs: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["deletePair"],
  setup(props, { emit }) {
    const deletePair = (id) => emit("deletePair", id);

    return { deletePair };
  },
};
</script>