<template>
  <button
    :type="buttonType"
    :disabled="disabled"
    class="py-2 px-4 rounded focus:outline-none focus:ring-2 ring-offset-2"
    :class="{
      'bg-green-200': colorType === 'success',
      'ring-green-300': colorType === 'success',
      'hover:bg-green-300': colorType === 'success' && !disabled,

      'bg-red-200': colorType === 'danger',
      'ring-red-300': colorType === 'danger',
      'hover:bg-red-300': colorType === 'danger' && !disabled,

      'm-auto': center,
      'opacity-50': disabled,
      'cursor-default': disabled,
    }"
  >
    <slot>Submit</slot>
  </button>
</template>

<script>
export default {
  props: {
    buttonType: {
      type: String,
      default: "button",
    },
    colorType: {
      type: String,
      default: "success",
    },
    center: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
};
</script>