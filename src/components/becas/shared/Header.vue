<template>
  <div>
  <v-app-bar height="55" color="secondary lighten-2" outline dark>
      <v-toolbar-title>{{ titulo }}</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-divider class="mx-4" inset vertical></v-divider>
      <div class="caption">
        {{ subTituloUno }}
        <br />
        {{ subTituloDos}}
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "becas-header",
  props: ["titulo", "subTituloUno", "subTituloDos"],
};
</script>

<style scoped>
.tamano {
  margin-block-end: -20px;
}
</style>