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
    <Bitacora />
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import Bitacora from '@/components/universidades/tramites/Bitacora'
export default {
  name: 'tramite-seguimiento',
  components: {
    Bitacora
  },
  data: () => ({
    nroTramite: '',
    tramite: ''
  }),
  methods: {
    async obtenerTramite() {
      try {
        let response = await UniversidadesService.getTramite(this.nroTramite)
        let data = response.data
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    async getBitacora() {
      try {
        let response = await UniversidadesService.getBitacoraTramite(this.tramite.id)
        let data = response.data
        if (data.status == 'success') {
          this.bitacora = data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style>

</style>