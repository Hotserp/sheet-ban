<template>
  <label class="block" :class="{ 'w-full': fullWidth }">
    <span class="text-gray-700 ml-2 text" v-if="labelText">
      {{ labelText }}
    </span>
    <input
      :type="inputType"
      class="
        mt-1
        block
        w-full
        rounded-md
        bg-gray-100
        border-transparent
        focus:border-gray-500
        focus:bg-white
        focus:ring-0
      "
      :placeholder="placeholder"
      v-model="value"
    />
    <span class="text-red-400 text" v-if="errorMessage">
      {{ errorMessage }}
    </span>
  </label>
</template>


<script>
import { useField } from "vee-validate";

export default {
  props: {
    name: { type: String, required: true },
    labelText: { type: String },
    fullWidth: { type: Boolean },
    placeholder: { type: String },
    inputType: { type: String, default: "text" },
  },
  setup(props) {
    const { value, errorMessage } = useField(props.name || "default");

    return { value, errorMessage };
  },
};
</script>