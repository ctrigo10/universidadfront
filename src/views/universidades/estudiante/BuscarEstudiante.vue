<template>
  <div>
    <!-- <h3>Buscar estudiante</h3> -->
    <v-card>
      <v-card-title primary-title>
        Buscar estudiante
      </v-card-title>
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

        <v-row v-if="estudiante != ''">
          <v-col cols="12" sm="6">
            <v-card> 
              <v-card-title>
                Datos del estudiante
              </v-card-title>
              <v-simple-table>
                <tbody>
                  <tr><th>Carnet de Identidad:</th><td>{{estudiante.carnet_identidad}}</td></tr>
                  <tr><th>Complemento:</th><td>{{estudiante.complemento}}</td></tr>
                  <tr><th>Nombre(s):</th><td>{{estudiante.nombre}}</td></tr>
                  <tr><th>Apellido Paterno:</th><td>{{estudiante.paterno}}</td></tr>
                  <tr><th>Apellido Materno:</th><td>{{estudiante.materno}}</td></tr>
                  <tr><th>Género:</th><td>{{estudiante.genero_tipo? estudiante.genero_tipo.genero : ''}}</td></tr>
                  <tr><th>Código RUDE:</th><td>{{estudiante.codigo_rude}}</td></tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card>
              <v-card-text>
                <v-btn color="secondary" @click="getRecordAcademico()">Record Académico</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>


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
import RecordAcademico from '@/components/universidades/academico/RecordAcademico'
import { mapMutations } from 'vuex';
export default {
  name: 'estudiante-buscar',
  components: {
    RecordAcademico
  },
  data: () => ({
    carnet: '',
    complemento: '',
    estudiante: '',
    dialogRecord: false,
    records: []
  }),
  methods: {
    ...mapMutations(['uniAlert']),
    async buscarEstudiante(){
      try {
        if (this.$refs.form.validate()) {
          let response = await UniversidadesService.getEstudiante(this.carnet, this.complemento);
          let data = await response.data;
          if (data.status == 'success') {
            if (data.data == null) {
              this.estudiante = ''
              this.uniAlert({color: 'error', text: 'El estudiante no fue encontrado'});
            }else{
              this.estudiante = data.data
            }
  
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

</style>