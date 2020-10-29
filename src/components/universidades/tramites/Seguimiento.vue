<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h4>SEGUIMIENTO</h4>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="nroTramite"
              label="Nro. de Trámite"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn color="primary" small class="mt-5"> <v-icon>mdi-magnify</v-icon> Buscar</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'tramite-seguimiento',
  data: () => ({
    nroTramite: ''
  })
}
</script>

<style>

</style>