<template>
  <div>
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="cerrar()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Detalle Trámite</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <!-- <v-btn
            dark
            text
            @click="dialog = false"
          >
            Save
          </v-btn> -->
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <h4>Bitácora</h4>
        <h3>Trámite Nro: {{idTramite}}</h3>

      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
export default {
  props: ['idTramite'],
  data: () => ({
    tramite: ''
  }),
  mounted(){
    this.obtenerBitacora()
  },
  // watch: {
  //   idTramite: function() {
  //     console.log(this.idTramite)
  //     this.obtenerBitacora()
  //   }
  // },
  methods: {
    async obtenerBitacora() {
      try {
        let response = await UniversidadesService.getBitacoraTramite(1671530)
        let data = await response.data
        console.log('bitacora', data)
      } catch (error) {
        console.log(error)
      }
    },
    cerrar() {
      this.$emit('cerrarDialog');
    }
  }
}
</script>

<style>

</style>