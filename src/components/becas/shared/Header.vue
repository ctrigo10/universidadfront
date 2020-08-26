<template>
    <div>
      <v-card-title>{{ titulo }}</v-card-title>
      <hr>
      <v-card-text class=" tamano headline text-center">{{ subTitulo }}</v-card-text>
    </div>
</template>

<script>
export default {
  name: 'becas-header',
  props:['titulo', 'subTitulo'],
  }
</script>

<style scoped>
.tamano {
    margin-block-end: -20px;
}
</style>