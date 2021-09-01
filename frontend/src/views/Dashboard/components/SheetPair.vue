<template>
  <div class="container bg-green-200 w-full my-2 rounded flex px-10 flex-wrap">
    <div class="mx-auto my-2 flex flex-col justify-evenly items-center">
      <a :href="pair.blackListTable.url" class="underline text-gray-700">
        Таблица ЧС 🔗
      </a>
      <a :href="pair.checkTable.url" class="underline text-gray-700">
        Проверяемая таблица 🔗
      </a>
    </div>

    <div class="mx-auto my-2 flex flex-col justify-evenly items-center">
      <p class="text-gray-700">Лист: {{ pair.blackListTable.sheetName }} 📄</p>
      <p class="text-gray-700">Лист: {{ pair.checkTable.sheetName }} 📄</p>
    </div>

    <div class="mx-auto my-2 flex flex-col justify-evenly items-center">
      <p class="text-gray-700">Колонка: {{ pair.blackListTable.columnName }}</p>
      <p class="text-gray-700">Колонка: {{ pair.checkTable.columnName }}</p>
    </div>

    <div class="mx-auto my-2 flex flex-col justify-evenly items-center">
      <p class="text-gray-700">Интервал: {{ pair.interval }} минут(ы)</p>
      <div class="text-gray-700 flex items-center">
        Цвет:
        <div
          class="w-16 h-8 rounded-md mx-2"
          :style="{
            'background-color': `rgb(${pair.color.red}, ${pair.color.green}, ${pair.color.blue})`,
          }"
        ></div>
      </div>
    </div>
    <div class="flex justify-center px-10 mt-auto mb-2 w-full">
      <Button colorType="danger" @click="deletePair" :disabled="disabled">
        Удалить 🗑
      </Button>
    </div>
  </div>
</template>

<script>
import Button from "@/components/shared/Button.vue";

import Api from "@/services/Api.js";

export default {
  components: {
    Button,
  },
  props: {
    pair: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["deletePair"],
  setup(props, { emit }) {
    const deletePair = async () => {
      const confirm = window.confirm("Удалить?");
      if (confirm) {
        await Api.deletePair(props.pair.id);
        emit("deletePair", props.pair.id);
      }
    };

    return { deletePair };
  },
};
</script>

<style scoped>
.container {
  min-height: 135px;
}
</style>