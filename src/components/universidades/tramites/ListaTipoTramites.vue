<template>
  <div>
    <v-simple-table>
      <thead>
        <tr>
          <th>Nro</th>
          <th>Trámite</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in tiposTramites" :key="i">
          <td>{{item.id}}</td>
          <td>{{item.tramite_tipo}}</td>
          <td> <v-icon @click="seleccionarTipo(item.id)">mdi-eye</v-icon> </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: ['tiposTramites'],
  methods: {
    seleccionarTipo(id) {
      this.$emit('seleccionarTipo', id)
    }
  }
}
</script>

<style>

</style>