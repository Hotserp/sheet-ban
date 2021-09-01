<template>
  <form @submit.prevent="onSubmit">
    <div class="flex flex-wrap">
      <div class="w-2/4 px-2 my-2">
        <TextField
          name="blackListTable.url"
          labelText="Ссылка на таблицу с черным списком:"
        />
      </div>
      <div class="w-1/4 px-2 my-2">
        <TextField
          name="blackListTable.sheetName"
          labelText="Название листа:"
        />
      </div>
      <div class="w-1/4 px-2 my-2">
        <TextField
          name="blackListTable.columnName"
          labelText="Название колонки:"
        />
      </div>

      <div class="w-2/4 px-2 my-2">
        <TextField
          name="checkTable.url"
          labelText="Ссылка на проверяемую таблицу:"
        />
      </div>
      <div class="w-1/4 px-2 my-2">
        <TextField name="checkTable.sheetName" labelText="Название листа:" />
      </div>
      <div class="w-1/4 px-2 my-2">
        <TextField name="checkTable.columnName" labelText="Название колонки:" />
      </div>

      <div class="w-1/2 px-2 my-2 flex relative">
        <ColorPickerField name="color" />
      </div>

      <div class="w-1/2 px-2 my-2">
        <TextField
          name="interval"
          inputType="number"
          labelText="Интервал(мин):"
        />
      </div>

      <div class="w-full flex my-4">
        <Button center buttonType="submit" :disabled="disabled">
          {{ isSubmitting ? "Загрузка..." : "Запуск" }}
        </Button>
      </div>
    </div>
  </form>
</template>

<script>
import { useForm } from "vee-validate";
import * as yup from "yup";

import TextField from "@/components/shared/TextField";
import ColorPickerField from "@/components/shared/ColorPickerField";
import Button from "@/components/shared/Button";

import Api from "@/services/Api";

const validationSchema = yup.object().shape({
  blackListTable: yup.object().shape({
    url: yup
      .string()
      .required("Введите ссылку")
      .matches(
        /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
        "Ссылка на таблицу должна быть валидной"
      ),
    sheetName: yup.string().required("Введите название листа"),
    columnName: yup.string().required("Введите название колонки"),
  }),
  checkTable: yup.object().shape({
    url: yup
      .string()
      .required("Введите ссылку")
      .matches(
        /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
        "Ссылка на таблицу должна быть валидной"
      ),
    sheetName: yup.string().required("Введите название листа"),
    columnName: yup.string().required("Введите название колонки"),
  }),
  interval: yup
    .number()
    .typeError("Нужно ввести число")
    .min(1, "Интервал не может быть чаще чем раз в минуту")
    .max(10800, "Интервал не может быть реже чем раз в 3 дня")
    .required("Введите интервал в минутах"),
});

export default {
  components: { TextField, Button, ColorPickerField },
  props: { disabled: { type: Boolean, default: false } },

  emits: ["addPair"],
  setup(props, { emit }) {
    const { handleSubmit, isSubmitting } = useForm({ validationSchema });
    const onSubmit = handleSubmit(async (values) => {
      const newPait = await Api.createComparePair(values);
      emit("addPair", newPait);
    });

    return {
      onSubmit,
      isSubmitting,
    };
  },
};
</script>


