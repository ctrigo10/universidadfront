<template>
  <div>
    <v-card>
      <ListaTipoTramites v-if="tipo == ''" :tiposTramites="tiposTramites" @seleccionarTipo="seleccionarTipo"/>
    </v-card>
    <FormNuevaCarreraDenominacion v-if="tipo == '56' || tipo == '57'" :idUniversidad="idUniversidad" :idTramiteTipo="tipo"/>
    <FormSolicitudToken v-if="tipo == '58'" :idUniversidad="idUniversidad" :idTramiteTipo="tipo"/>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import ListaTipoTramites from '@/components/universidades/tramites/ListaTipoTramites'
import FormNuevaCarreraDenominacion from '@/components/universidades/tramites/FormNuevaCarreraDenominacion'
import FormSolicitudToken from '@/components/universidades/tramites/FormSolicitudToken'
export default {
  name: 'nuevo-tramite',
  components: {
    ListaTipoTramites,
    FormNuevaCarreraDenominacion,
    FormSolicitudToken
  },
  props: ['idUniversidad'],
  data: () => ({
    tiposTramites: [],
    tipo: ''
  }),
  mounted(){
    this.getTiposTramites()
  },
  methods: {
    async getTiposTramites() {
      try {
        let response = await UniversidadesService.getTiposTramites()
        let data = response.data.data
        this.tiposTramites = data;
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    seleccionarTipo(id){
      this.tipo = id
      console.log(this.tipo)
    }
  }
}
</script>

<style>

</style>