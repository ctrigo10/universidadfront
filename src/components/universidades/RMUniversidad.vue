<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{on, attrs}">    
        <v-btn class="btn-accion" @click="rmdialog = true" v-bind="attrs" v-on="on">
          <v-icon>mdi-file</v-icon>
        </v-btn>
      </template>
      <span>Resolucion ministerial</span>
    </v-tooltip>

    <v-dialog
      v-model="rmdialog"
      max-width="600px"
      transition="dialog-transition"
      :persistent="getPersistent"
    >
      <v-card class="card-resolucion">
        <v-card-title>
          Resolución Ministerial - <small>{{universidad}}</small>
        </v-card-title>
        <v-card-text>
          <v-btn class="btn-agregar" color="primary" v-if="resolucion.id == '' && modo == 'lista'" @click="modo = 'crear'">Agregar</v-btn>
          <div v-if="resolucion.id != '' && modo == 'lista'">
            <v-row>
              <v-col cols="12" sm="5">
                <a :href="resolucion.archivo" target="_blank">
                  <div class="archivoRM" :to="resolucion.archivo">
                    <v-icon class="logo-pdf">mdi-file-pdf</v-icon>
                  </div>
                </a>
              </v-col>
              <v-col cols="12" sm="5">
                <div class="texto">
                  <h4>Número</h4>
                  {{ resolucion.nro_resolucion }}
                  <h4>Fecha</h4>
                  {{resolucion.fecha_resolucion}}
                  <h4>Descripción</h4>
                  {{resolucion.descripcion }}
                </div>
                <div>
                  <v-btn
                    color="primary"
                    @click="modo = 'editar'"
                  >
                    Editar
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </div>
          <div v-if="modo == 'crear' || modo == 'editar'">
            <v-form
              ref="formRMU"
            >
              <v-card-text >
                <v-row>
                  <v-col cols="12" sm="6" ma-1>
                    <v-text-field
                      v-model="resolucion.nro_resolucion" 
                      label="Número" 
                      placeholder="" 
                      filled
                      :rules="[v => !!v || 'El número es requerido']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
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
                          v-model="resolucion.fecha_resolucion"
                          label="Fecha"
                          prepend-icon="mdi-calendar"
                          placeholder="aaaa/mm/dd"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          filled
                          :rules="[v => !!v || 'La fecha es requerida']"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="resolucion.fecha_resolucion" @input="menu1 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-text-field v-model="resolucion.descripcion" label="Descripción" placeholder="" filled></v-text-field>
                <v-file-input
                  label="Archivo de la R.M." 
                  v-model="resolucion.file" 
                  filled
                  :rules="modo == 'crear' ? [v => !!v || 'El archivo es requerido'] : []"
                ></v-file-input>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary"
                  @click="cancelar"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  @click="create"
                  v-show="modo == 'crear'"
                >
                  Registrar
                </v-btn>
                <v-btn
                  color="primary"
                  @click="update"
                  v-show="modo == 'editar'"
                >
                  Actualizar
                </v-btn>
              </v-card-actions>
            </v-form>
          </div>
        </v-card-text>
      </v-card>


    </v-dialog>

  </span>
</template>
<script>
import Servicio from '../../services/general'
import axios from 'axios'
export default {
  name: 'rm-universidad',
  props: [
    'idUniversidad',
    'universidad'
  ],
  data: () => ({
    rmdialog: false,
    modo: 'lista',
    menu1: false,
    search: '',
    headers: [
      { text: 'Número', value: 'numero'},
      { text: 'Fecha', value: 'fecha'},
      { text: 'Descripción', value: 'descripcion'},
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
    ],
    resolucion: {
      id: '',
      idUniversidad: '',
      descripcion: '',
      nro_resolucion: '',
      fecha_resolucion: '',
      file: '',
      archivo: ''
    },
    resoluciones: [],
  }),
  computed: {
    getPersistent(){
      if (this.modo == 'lista') {
        return false;
      }
      return true;
    }
  },
  mounted(){
    // this.modo = 'lista';
    this.resolucion.idUniversidad = this.idUniversidad;
    this.getResolucion();
  },
  methods: {
    closeDialog(){
      this.rmdialog = false;
    },
    getResolucion(){
        axios.get(`http://localhost:3000/universidad/verArchivo/${this.idUniversidad}`).then(response => {
          if (response.data.status == 'success') {
            this.resolucion.id = response.data.data.id;
            this.resolucion.idUniversidad = response.data.data.institucioneducativa_id;
            this.resolucion.descripcion = response.data.data.descripcion;
            this.resolucion.nro_resolucion = response.data.data.nro_resolucion;
            this.resolucion.fecha_resolucion = response.data.data.fecha_resolucion;
            this.resolucion.file = Servicio.getServe() + response.data.data.archivo;
            this.resolucion.archivo = Servicio.getServe() + response.data.data.archivo;
  
            console.log(this.resolucion)
          }
        }).catch((e) => {
          console.log(e)
        });
    },
    cancelar(){
      this.modo = 'lista';
    },
    create(){
      if (this.$refs.formRMU.validate()) {
        let data = new FormData();
        data.append('descripcion', this.resolucion.descripcion);
        data.append('nro_resolucion', this.resolucion.nro_resolucion);
        data.append('fecha_resolucion', this.resolucion.fecha_resolucion);
        data.append('iduniversidad', this.idUniversidad);
        data.append('file', this.resolucion.file);
  
        axios.post(`http://localhost:3000/universidad/archivoNuevoRM`, data).then(response => {
          if (response.data.status == 'success') {
            console.log('Registrado')
            this.getResolucion();
            this.modo = 'lista';
          }
        });
      }
    },
    edit(item){
      this.resolucion.id = item.id;
      this.resolucion.descripcion = item.descripcion;
      this.resolucion.nro_resolucion = item.nro_resolucion;
      this.resolucion.fecha_resolucion = item.fecha_resolucion;
      this.resolucion.file = null;

      this.modo = 'editar';
    },
    update(){
      if (this.$refs.formRMU.validate()) {
        let data = new FormData();
        data.append('descripcion', this.resolucion.descripcion);
        data.append('nro_resolucion', this.resolucion.nro_resolucion);
        data.append('fecha_resolucion', this.resolucion.fecha_resolucion);
        data.append('file', this.resolucion.file);

        axios.put(`http://localhost:3000/universidad/archivoRM/${this.idUniversidad}`, data).then(response => {
          if (response.data.status == 'success') {
            console.log('Registrado')
            this.getResolucion();
            this.modo = 'lista';
            this.$vToastify.success("Registro actualizado correctamente");
          }
        });
      }
    },
    deleted(id){
      this.$swal({
        title: '¿Eliminar?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          axios.delete(`http://localhost:3000/carreraUni/archivoNuevoRM/${id}`).then(response => {
            if (response.data.status == 'success') {
              console.log('Eliminado')
              this.getResolucion();
              this.modo = 'lista';
              this.$vToastify.success("Registro eliminado correctamente");
            }
          });
        }
      });
    }
  },
}
</script>
<style scope>
  small {
    color: #CCCCCC;
  }
  .card-resolucion {
    min-height: 300px;
  }
  .btn-agregar{
    padding-top: 30px;
  }
  .archivoRM{
    background: #EEEEEE;
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .archivoRM:hover{
    background: #DDDDDD;
  }
  a {
    text-decoration: none;
  }

  .logo-pdf{
    font-size: 70px !important;
    color: rgb(248, 73, 73) !important;
  }
  .texto{
    margin-bottom: 15px;
    font-weight: bold;
  }
  h4{
    font-weight: 300;
    margin-top: 5px;
  }
</style>