<template>
  <label class="block">
    <span class="text-gray-700 ml-2 text">Цвет ячейки: </span>
    <div
      class="w-16 h-8 rounded-md mt-1 ml-1 color-square"
      :style="{ 'background-color': rgbColor }"
      @click="toggleColorPicker"
    ></div>
  </label>

  <div class="absolute left-12 top-6" v-if="showColorPicker">
    <ColorPicker theme="light" :color="rgbColor" @changeColor="changeColor" />
  </div>
</template>

<script>
import { ColorPicker } from "vue-color-kit";

import { ref, computed } from "vue";
import { useField } from "vee-validate";

export default {
  props: { name: { type: String, required: true } },
  components: { ColorPicker },
  setup(props) {
    const showColorPicker = ref(false);
    const toggleColorPicker = () => {
      return (showColorPicker.value = !showColorPicker.value);
    };

    const { value } = useField(props.name, null, {
      initialValue: { red: 255, green: 0, blue: 0 },
    });

    const changeColor = (newColor) => {
      value.value = {
        red: newColor.rgba.r,
        green: newColor.rgba.g,
        blue: newColor.rgba.b,
      };
    };

    const rgbColor = computed(() => {
      const { red, green, blue } = value.value;
      return `rgb(${red}, ${green}, ${blue})`;
    });

    return {
      toggleColorPicker,
      changeColor,
      rgbColor,
      showColorPicker,
    };
  },
};
</script>

<style scoped>
.color-square {
  cursor: pointer;
}
</style>
