<template>
  <div>
    <v-card>
      <v-form ref="formToken">
        <v-card-text>
          <h2 class="form-title">Formulario de Solicitud</h2>
          <h3 class="form-title" v-text="'Actualización de Token'"></h3>

          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                :items="universidades"
                item-value="id"
                item-text="institucioneducativa"
                v-model="universidad"
                label="Universidad"
                :rules="[v => !!v || 'El campo es requerido']"
                @change="cargarSedeSubsede"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                :items="sedesSubsedes"
                item-value="id"
                item-text="nombre_sede_subsede"
                v-model="universidad_id"
                label="Sede/Subsede"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-select>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" sm="6">
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
  props: ['idTramiteTipo'],
  data: () => ({
    universidades: [],
    sedesSubsedes: [],
    universidad: '',
    universidad_id: '',
    observacion: ''
  }),
  mounted() {
    this.getUniversidades()
  },
  methods: {
    ...mapMutations(['uniAlert']),
    async getUniversidades() {
      try {
        let response = await UniversidadesService.getUniversidades()
        let data = response.data.data
        this.universidades = data;
        console.log('data', data)
      } catch (error) {
        console.log(error)
      }
    },
    async cargarSedeSubsede() {
      try {
        let response = await UniversidadesService.getSedesSubsedesUniversidad(this.universidad)
        let data = await response.data.data
        this.sedesSubsedes = data;
      } catch (error) {
        console.log(error)
      }
    },
    async solicitarToken() {
      try {
        if (this.$refs.formToken.validate()) {
          let datos = {
            tipotramite_id: this.idTramiteTipo,
            universidad_id: this.universidad_id,
            tramite_id: '',
            valor_evaluacion: '',
            observacion: this.observacion,
            datos: {
              universidad_id: this.universidad_id,
              observacion: this.observacion
            }
          }
          let response = await UniversidadesService.solicitarToken(datos)
          let data = await response.data
          console.log(data)
          this.uniAlert({color: 'success', text: 'Solicitud enviada correctamente'})

          this.$emit('solicitud_enviada', true)
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