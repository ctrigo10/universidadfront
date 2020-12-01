<template>
  <div>
    <v-card class="form-procesa-tecnico">
      <v-form ref="form">
        <v-card-title primary-title>
          <h5>Respuesta</h5>
        </v-card-title>
        <v-card-text>
            ¿El trámite Procede ?
            <v-radio-group
              v-model="procede"
              row
            >
              <v-radio
                label="Si"
                value="SI"
              ></v-radio>
              <v-radio
                label="No"
                value="NO"
              ></v-radio>
            </v-radio-group>

            <div v-if="procede == 'NO'">
              <v-row>
                <v-col cols="12" sm="12">
                  ¿Que desea hacer con el trámite?
                  <v-radio-group
                    v-model="finaliza"
                    row
                  >
                    <v-radio
                      label="Finalizar el Trámite"
                      value="SI"
                    ></v-radio>
                    <v-radio
                      label="Devolver a la Universidad"
                      value="NO"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="12" v-show="finaliza == 'NO'">
                    <v-textarea
                      outlined
                      label="Registre una observacion"
                      v-model="observacion"
                      rows="3"
                    ></v-textarea>
                      <!-- :rules="[v => !!v || 'El campo es requerido']" -->
                </v-col>
              </v-row>
            </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="enviarTramiteTecnico()">{{textBotonEnviar}}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import { mapMutations } from 'vuex'
export default {
  name: 'form-procesar-tecnico',
  props: ['tramite','datos'],
  data: () => ({
    procede: 'SI',
    observacion: '',
    finaliza: 'SI',
  }),
  computed: {
    textBotonEnviar() {
      if (this.procede == 'SI') {
        return 'Aprobar y finalizar'
      }else{
        if (this.finaliza == 'SI') {
          return 'Finalizar'
        }else{
          return 'Devolver a Universidad'
        }
      }
      // return 'Enviar'
    }
  },
  methods: {
    ...mapMutations(['uniAlert']),
    // METODO PARA DEVLVER
    async enviarTramiteTecnico() {
      try {
        // ENVIAMOS EL TRAMITE A LA SIGUIENTE TAREA
        let datos = {
          tipotramite_id: '',
          universidad_id: '',
          tramite_id: this.tramite.tramite_id,
          valor_evaluacion: this.procede,
          observacion: '',
          datos: ''
        }
        let response = await UniversidadesService.enviarTramite(datos)
        let data = await response.data
        if (data.status == 'success') {
          // RECEPCIONAMOS EN LA SIGUIENTE TAREA
          let datos1 = {
            tipotramite_id: '',
            universidad_id: '',
            tramite_id: this.tramite.tramite_id,
            valor_evaluacion: '',
            observacion: '',
            datos: ''
          }
          let response1 = await UniversidadesService.enviarTramite(datos1)
          let data1 = await response1.data
          if (data1.status == 'success') {
            // SI PROCEDE ES SI ENTONCES REGISTRAMOS EL JSON
            if (this.procede == 'SI') {
              let tipo = this.tramite.tramite.tramite_tipo;
              // corergit
              if (tipo == 56) { // REGISTRO NUEVA CARRERA
                let response2 = await UniversidadesService.createNuevaCarrera(this.datos)
                let data2 = await response2.data
                console.log('response data registrar carrera', data2)
              }
              if (tipo == 57) { // REGISTRO NUEVA DENOMINACION
                let response3 = await UniversidadesService.createNuevaDenominacion(this.datos)
                let data3 = await response3.data
                console.log('response data registrar carrera', data3)
              }
              if (tipo == 58) { // REGISTRO TOKEN
                let response4 = await UniversidadesService.createNuevaCarrera(this.datos)
                let data4 = await response4.data
                console.log('response data registrar carrera', data4)
              }
              // switch (tipo) {
              //   case 56: // REGISTRO DE CARRERA
              //     let response2 = await UniversidadesService.createNuevaCarrera(this.datos)
              //     let data2 = await response2.data
              //     console.log('response data registrar carrera', data2)
              //     break;
              //   case 57: // REGISTRO DE DENOMINACION
              //     let response3 = await UniversidadesService.createNuevaDenominacion(this.datos)
              //     let data3 = await response3.data
              //     console.log('response data registrar carrera', data3)
              //     break;
              //   case 58: // REGISTRO DE DENOMINACION
              //     let response4 = await UniversidadesService.createNuevaCarrera(this.datosJson)
              //     let data4 = await response4.data
              //     console.log('response data registrar carrera', data4)
              //     break;
              // }
              
              let datos2 = {
                tipotramite_id: '',
                universidad_id: '',
                tramite_id: this.tramite.tramite_id,
                valor_evaluacion: '',
                observacion: '',
                datos: ''
              }
              let response5 = await UniversidadesService.enviarTramite(datos2)
              let data5 = await response5.data
              if (data5.status == 'success') {
                let datos6 = {
                  tipotramite_id: '',
                  universidad_id: '',
                  tramite_id: this.tramite.tramite_id,
                  valor_evaluacion: '',
                  observacion: '',
                  datos: ''
                }
                let response6 = await UniversidadesService.enviarTramite(datos6)
                let data6 = await response6.data
                if (data6.status == 'success') {
                  this.uniAlert({color: 'success', text: 'Registro realizado correctamente'})
                }
              }

            }else{
              // SI EL TRÁMITE NO PROCEDE - ENVIAMOS EL TRAMITE A LA SIGUIENTE TAREA CON LA VARIABLE DE EVALUACION Y CON LA OBSERVACION
              let datos7 = {
                tipotramite_id: '',
                universidad_id: '',
                tramite_id: this.tramite.tramite_id,
                valor_evaluacion: this.finaliza,
                observacion: this.observacion,
                datos: ''
              }
              let response7 = await UniversidadesService.enviarTramite(datos7)
                let data7 = await response7.data
                if (data7.status == 'success') {
                  if (this.finaliza == 'SI') {
                    
                    let datos8 = {
                      tipotramite_id: '',
                      universidad_id: '',
                      tramite_id: this.tramite.tramite_id,
                      valor_evaluacion: this.finaliza,
                      observacion: this.observacion,
                      datos: ''
                    }
                    let response8 = await UniversidadesService.enviarTramite(datos8)
                    let data8 = await response8.data
                    if (data8.status == 'success') {
                      
                      this.uniAlert({color: 'success', text: 'Registro realizado correctamente'})
                    }
                  }else{
                     this.uniAlert({color: 'success', text: 'Registro realizado correctamente'})
                  }
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
        this.uniAlert({color: 'error', text: 'Ocurrio un error al enviar la solicitud'})
      }
    }
  }
}
</script>

<style>
  .form-procesa-tecnico {
    /* background-color: #f3f3f3 !important; */
  }
</style>