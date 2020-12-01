<template>
  <div>
    <v-card>
      <v-form ref="formToken">
        <v-card-text>
          <h2 class="form-title">Formulario de Solicitud</h2>
          <h3 class="form-title" v-text="'Actualización de Token'"></h3>
          <v-row>
            <v-col cols="12" sm="6" class="ml-auto mr-auto">
              <v-textarea
                outlined
                label="Justificación"
                v-model="observacion"
                placeholder="Ingrese el motivo por el cual esta solicitando la actualización del Token"
                rows="3"
                :rules="[v => !!v || 'La justificación es requerida']"
              ></v-textarea> 
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="cancelar">Cancelar</v-btn>
          <v-btn color="primary" @click="solicitarToken">Solicitar Token</v-btn>
        </v-card-actions>
      </v-form>
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
    },
    cancelar() {
      this.$emit('cancelar', true);
    }
  }
}
</script>

<style>

</style>