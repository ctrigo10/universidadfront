<template>
  <div>
    <h3>Trámites</h3>
    <v-btn-toggle
      v-model="toggle_exclusive"
      rounded
      color="purple"
    >
      <v-btn>Nuevo</v-btn>
      <v-btn>Recibidos</v-btn>
      <v-btn>Enviados</v-btn>
      <v-btn>Pendientes</v-btn>
      <v-btn>Concluidos</v-btn>
      <v-btn>Seguimiento</v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
export default {
  data: () => ({
    toggle_exclusive: 0
  })
}
</script>

<style>

</style>