<template>
  <div>
    <Breadcrumbs :items="breadItems"/>
    <v-card>
      
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="carnet"
                label="Carnet de Identidad"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="2">
              <v-text-field
                v-model="complemento"
                label="Complemento"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="2">
              <v-btn color="primary" small class="mt-5" @click="buscarEstudiante()"> <v-icon>mdi-magnify</v-icon> Buscar</v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-progress-circular
          indeterminate
          color="primary"
          v-if="buscando"
        ></v-progress-circular>

        <div v-if="!buscando">
          <v-row v-if="estudiante != ''">
            <v-col cols="12" sm="12">
              <v-card> 
                <v-card-title>
                  Datos del estudiante
                </v-card-title>
                <v-simple-table class="v-table">
                  <tbody>
                    <tr>
                      <td rowspan="4">
                        <img class="logo-imagen" src="../../../assets/user.svg"/>
                      </td>
                      <th>Carnet de Identidad:</th><td>{{estudiante.carnet_identidad}}</td>
                      <th>Complemento:</th><td>{{estudiante.complemento}}</td>
                    </tr>
                    <tr>
                      <th>Nombre(s):</th><td>{{estudiante.nombre}}</td>
                      <th>Apellido Paterno:</th><td>{{estudiante.paterno}}</td>
                    </tr>
                    <tr>
                      <th>Apellido Materno:</th><td>{{estudiante.materno}}</td>
                      <th>Género:</th><td>{{estudiante.genero_tipo? estudiante.genero_tipo.genero : ''}}</td>
                    </tr>
                    <tr>
                      <th>Código RUDE:</th><td>{{estudiante.codigo_rude}}</td>
                      <th></th><td></td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card>
            </v-col>

            <!-- <v-col cols="12" sm="6">
              <v-card>
                <v-card-text>
                  <v-btn color="secondary" @click="getRecordAcademico()">Record Académico</v-btn>
                </v-card-text>
              </v-card>
            </v-col> -->
          </v-row>

          <v-card v-if="estudiante == '' && buscado">
            <v-alert
              icon="mdi-information-outline"
              text
              type="info"
            >
              El estudiante no fue encontrado
            </v-alert>
          </v-card>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="dialogRecord"
      scrollable
      max-width="800px"
      transition="dialog-transition"
    >
    
      <RecordAcademico :records="records" :estudiante="estudiante"/>
    </v-dialog>

  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import Breadcrumbs from '@/components/universidades/utils/Breadcrumbs'
import RecordAcademico from '@/components/universidades/academico/RecordAcademico'
import { mapMutations } from 'vuex';
export default {
  name: 'estudiante-buscar',
  components: {
    Breadcrumbs,
    RecordAcademico
  },
  data: () => ({
    breadItems: [
      { text: 'Buscar estudiante', disabled: true }
    ],
    carnet: '',
    complemento: '',
    estudiante: '',
    dialogRecord: false,
    records: [],
    buscado: false,
    buscando: false
  }),
  methods: {
    ...mapMutations(['uniAlert']),
    async buscarEstudiante(){
      try {
        if (this.$refs.form.validate()) {
          
          this.buscando = true

          let response = await UniversidadesService.getEstudiante(this.carnet, this.complemento);
          let data = await response.data;
          if (data.status == 'success') {
            if (data.data == null) {
              this.estudiante = ''
              this.buscado = true
              // this.uniAlert({color: 'error', text: 'El estudiante no fue encontrado'});
            }else{
              this.estudiante = data.data
            }
            this.buscando = false
          }else{
            this.uniAlert({color: 'error', text: 'El estudiante no fue encontrado'});
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getRecordAcademico(){
      try {
        let datos = await UniversidadesService.getRecordAcademico(null, null, this.estudiante.carnet_identidad)
        if (datos.length == 0) {
          this.uniAlert({color: 'warning', text: 'El estudiante no cuenta con un record académico'})
          return;
        }
        this.records = datos;
        this.dialogRecord = true;

      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style>
  .logo-imagen {
    width: 150px;
    height: auto;
    opacity: 0.7;
  }

  .v-table tr:hover:not(.v-table__expanded__content) {
    background: white !important;
  }
  .v-table th{
    color: #1a578d;
    font-size: 0.8rem !important;
    font-weight: 500;
  }
</style>