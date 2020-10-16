<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Gestión de Operativos
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openModal">Crear operativo</v-btn>
        </v-row>
        <br>
        <v-simple-table>
          <thead>
            <tr>
              <th>Operativo</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de finalización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(operativo, i) in operativos" :key="i">
              <td>{{operativo.nombre_operativo}}</td>
              <td>{{operativo.fecha_inicio}}</td>
              <td>{{operativo.fecha_final}}</td>
              <td>
                <v-btn color="primary" @click="editar(operativo)"  class="btn-accion"> <v-icon>mdi-pencil</v-icon> </v-btn>
                <v-btn color="primary" @click="eliminar(operativo.id)" class="btn-accion"> <v-icon>mdi-delete</v-icon> </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="dialogOperativo"
      max-width="500px"
    >
      <v-card>
        <v-card-title primary-title>
          {{mode}} Operativo
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="operativo.nombre_operativo"
                  label="Nombre del operativo"
                  :rules="[v => !!v || 'El nombre_operativo es requerido']"
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="operativo.fecha_inicio"
                      label="Fecha de Inicio"
                      prepend-icon="mdi-calendar"
                      placeholder="dd/mm/aaaa"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      filled
                      :rules="[v => !!v || 'La fecha de inicio es requerida']"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="operativo.fecha_inicio" @input="menu1 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col sm="6">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="operativo.fecha_final"
                      label="Fecha de finalización"
                      prepend-icon="mdi-calendar"
                      placeholder="dd/mm/aaaa"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      filled
                      :rules="[v => !!v || 'La fecha de finalización es requerida']"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="operativo.fecha_final" @input="menu2 = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogOperativo = false">Cancelar</v-btn>
          <v-btn color="primary" v-if="mode == 'Crear'" @click="registrar">Registrar</v-btn>
          <v-btn color="primary" v-if="mode == 'Editar'" @click="actualizar">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import { mapMutations } from 'vuex';
export default {
  name: 'gestion-operativos',
  data: () => ({
    dialogOperativo: false,
    operativos: [],
    operativo: {
      id: '',
      nombre_operativo: '',
      fecha_inicio: '',
      fecha_final: ''
    },
    mode: '',
    menu1: false,
    menu2: false
  }),
  mounted() {
    this.getOperativos()
  },
  methods: {
    ...mapMutations(['uniAlert']),
    async getOperativos(){
      try {
        let response = await UniversidadesService.getOperativos();
        let data = response.data.data;
        this.operativos = data;
      } catch (error) {
        console.log(error)
      }
    },
    openModal(){
      this.operativo.id = ''
      this.operativo.nombre_operativo = ''
      this.operativo.fecha_inicio = ''
      this.operativo.fecha_final = ''
      this.dialogOperativo = true
      this.mode = 'Crear'
    },
    async registrar(){
      if (this.$refs.form.validate()) {
        try {
          let response = await UniversidadesService.createOperativo(this.operativo);
          let data = response.data.data;
          console.log(data)
          this.uniAlert({color: 'success', text: 'Registro realizado correctamente'})
          this.getOperativos()
          this.dialogOperativo = false
        } catch (error) {
          console.log(error)
          this.uniAlert({color: 'error', text: 'Error al realizar el registro'})
        }
      }
    },
    editar(item){
      this.operativo.id = item.id
      this.operativo.nombre_operativo = item.nombre_operativo
      this.operativo.fecha_inicio = item.fecha_inicio
      this.operativo.fecha_final = item.fecha_final

      this.mode = 'Editar'
      this.dialogOperativo = true
    },
    async actualizar(){
      if (this.$refs.form.validate()) {
        try {
          let response = await UniversidadesService.updateOperativo(this.operativo.id, this.operativo);
          let data = response.data.data;
          console.log(data)
          this.uniAlert({color: 'success', text: 'Registro actualizado correctamente'})
          this.getOperativos()
          this.dialogOperativo = false
        } catch (error) {
          console.log(error)
          this.uniAlert({color: 'error', text: 'Error al realizar la actualización'})
        }
      }
    },
    async eliminar(id){
      try {
        let response = await UniversidadesService.deleteOperativo(id);
        let data = response.data.data;
        console.log(data)
        this.uniAlert({color: 'success', text: 'Registro eliminado correctamente'})
        this.getOperativos()
      } catch (error) {
        console.log(error)
        this.uniAlert({color: 'error', text: 'Error al eliminar el registro'})
      }
    },
  }
}
</script>

<style>

</style>