<template>
  <div>
    <v-app-bar height="55" color="secondary lighten-2" outline dark>
      <!-- <v-toolbar-title>{{ getCapitalize(titulo) }}</v-toolbar-title> -->
      <v-toolbar-title v-if="getDisplayGrande">{{ titulo }}</v-toolbar-title>
      <v-toolbar-title v-else class="body-2">{{ titulo }}<br><div class="caption">{{ subTituloUno }}<br>{{ subTituloDos }}</div></v-toolbar-title>
      <template v-if="getDisplayGrande">
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-divider class="mx-4" inset vertical></v-divider>
        <div class="caption">
          {{ subTituloUno }}
          <br />
          {{ subTituloDos }}
        </div>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "becas-header",
  props: ["titulo", "subTituloUno", "subTituloDos"],
  computed: {
    ...mapGetters(["getCapitalize", "getDisplayGrande"]),
  },
};
</script>

<style scoped>
.tamano {
  margin-block-end: -20px;
}
</style>