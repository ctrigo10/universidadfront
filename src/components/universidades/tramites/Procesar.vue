<template>
  <div>
    <v-card elevation="0">
      <v-card-title primary-title>
        <h4>Trámite Nro: {{tramite.tramite_id}}</h4>
      </v-card-title>
      <v-card-text>
        <v-simple-table>
          <tr><th>Nro. Tramite</th> {{tramite.tramite_id}}<td></td></tr>
          <tr><th>Tipo de trámite</th> {{tramite.tramite.tramiteTipo.tramite_tipo}}<td></td></tr>
          <tr><th>Universidad</th> {{tramite.tramite.institucioneducativa.institucioneducativa}}<td></td></tr>
          <tr><th>Fecha de solicitud</th> {{tramite.fecha_envio}}<td></td></tr>
        </v-simple-table>
        <FormEditarCarreraDenominacion :tramite="tramite"/>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import FormEditarCarreraDenominacion from '@/components/universidades/tramites/FormEditarCarreraDenominacion'
export default {
  name: 'tramite-procesar',
  components: {
    FormEditarCarreraDenominacion
  },
  props: ['tramite'],
  data: () => ({

  })
}
</script>

<style>

</style>