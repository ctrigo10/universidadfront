<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Formulario de solicitud de TOKEN
      </v-card-title>
      <v-card-text>
        <v-form ref="formToken">
          <v-row>
            <v-col cols="12" sm="12">
              <v-textarea
                outlined
                label="Justificación"
                v-model="observacion"
                rows="4"
                :rules="[v => !!v || 'La justificación es requerida']"
              ></v-textarea> 
              <v-btn color="primary" @click="solicitarToken">Solicitar Token</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import { mapMutations } from 'vuex'
export default {
  props: ['idUniversidad','idTramiteTipo'],
  data: () => ({
    observacion: ''
  }),
  methods: {
    ...mapMutations(['uniAlert']),
    async solicitarToken() {
      try {
        if (this.$refs.formToken.validate()) {
          let datos = {
            tipotramite_id: this.idTramiteTipo,
            universidad_id: this.idUniversidad,
            tramite_id: '',
            valor_evaluacion: '',
            observacion: this.observacion,
            datos: ''
          }
          let response = await UniversidadesService.solicitarToken(datos)
          let data = await response.data
          console.log(data)
          this.uniAlert({color: 'success', text: 'Solicitud enviada correctamente'})
        }
      } catch (error) {
        console.log('error')
      }
    }
  }
}
</script>

<style>

</style>