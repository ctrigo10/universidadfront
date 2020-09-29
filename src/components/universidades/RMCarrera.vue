<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{attrs, on}">
        <v-btn class="btn-accion" @click="rmdialog = true" v-bind="attrs" v-on="on">
          <v-icon>mdi-file</v-icon>
        </v-btn>
      </template>
      <span>Resoluciones Ministeriales</span>
    </v-tooltip>

    <v-dialog
      v-model="rmdialog"
      max-width="900px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>
          R.M. - {{universidad}} - {{denominacion_titulo_id}}
        </v-card-title>
        <v-card-text>
          <!-- <v-row>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="modo = 'crear'">Agregar</v-btn>
          </v-row> -->
          <v-tabs
            color="primary"
          >
            <v-tab @click="modo = 'lista'">Resoluciones registradas</v-tab>
            <v-tab @click="modo = 'crear'"> Agregar R.M. </v-tab>
          </v-tabs>
          <div v-show="modo == 'lista'">
            <v-data-table
              :headers="headers"
              :items="resoluciones"
              :search="search"
            >
              <template v-slot:[`item.acciones`]="{ item }">
                <!-- <a href="{{item.path}}" class="btn-accion" target="_blank">
                  <v-icon>mdi-file</v-icon>
                </a> -->
                <!-- <router-link
                  to="http://localhost:3000/{{item.path}}"
                > -->
                  <!-- {{host + item.archivo}} -->
                  <!-- <v-btn class="btn-accion" :to="item.path">
                    <v-icon>mdi-file</v-icon>
                  </v-btn> -->
                <v-tooltip top>
                  <template v-slot:activator="{attrs, on}">
                    <a :href="host + item.archivo" target="_blank" v-bind="attrs" v-on="on"><v-icon>mdi-file</v-icon></a>
                  </template>
                  <span>Ver archivo</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{attrs, on}">
                    <v-btn @click="edit(item)" class="btn-accion" v-bind="attrs" v-on="on">
                      <v-icon>mdi-pencil-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{attrs, on}">
                    <v-btn class="btn-accion" @click="deleted(item.id)" v-bind="attrs" v-on="on">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
              </template>
            </v-data-table>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red"
                text
                @click="closeDialog"
              >
                Cerrar
              </v-btn>
            </v-card-actions>
          </div>
          <div v-if="modo == 'crear' || modo == 'editar'">
            <v-form
              ref="formRMC"
            >
              <v-card-text >
                <v-row>
                  <v-col cols="12" sm="6" ma-1>
                    <v-text-field
                      v-model="resolucion.numero" 
                      label="Número de Resolución Ministerial" 
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
                          v-model="resolucion.fecha"
                          label="Fecha R.M."
                          prepend-icon="mdi-calendar"
                          placeholder="aaa/mm/dd"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          filled
                          :rules="[v => !!v || 'La fecha es requerida']"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="resolucion.fecha" @input="menu1 = false"></v-date-picker>
                    </v-menu>
                    <!-- <v-text-field v-model="resolucion.fecha" label="Fecha" placeholder="" filled></v-text-field> -->
                  </v-col>
                </v-row>
                <v-text-field v-model="resolucion.descripcion" label="Descripción" placeholder="" filled></v-text-field>
                <!-- <v-file-input accept="image/*" label="Archivo de la R.M." v-model="resolucion.file" filled></v-file-input> -->
                <v-file-input
                  label="Archivo de la R.M." 
                  v-model="resolucion.archivo" 
                  filled
                  :rules=" modo == 'crear' ? [v => !!v || 'El archivo es requerido'] : []"
                ></v-file-input>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary"
                  @click="closeDialog"
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
import { mapMutations } from 'vuex';
export default {
  name: 'rm-carrera',
  props: [
    'denominacion_titulo_id',
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
      ttec_denominacion_titulo_profesional_tipo_id: '',
      numero: '',
      fecha: '',
      descripcion: '',
      archivo: ''
    },
    resoluciones: [],
    host: '',
    snack: {
      state: false,
      color: "success",
      mode: "",
      timeout: 3000,
      text: ""
    }
  }),
  mounted(){
    this.host = Servicio.getServe();
    this.modo = 'lista';
    this.resolucion.ttec_denominacion_titulo_profesional_tipo_id = this.denominacion_titulo_id;
    this.getResoluciones();
  },
  methods: {
    ...mapMutations(['uniAlert']),
    closeDialog(){
      this.rmdialog = false;
    },
    getResoluciones(){
      axios.get(Servicio.getServe() + `carreraUni/resolucionCarrera/${this.denominacion_titulo_id}`).then(response => {
        this.resoluciones = response.data.data;
        console.log(this.resoluciones)
      });
    },
    create(){
      if (this.$refs.formRMC.validate()) {
        let data = new FormData();
        data.append('ttec_denominacion_titulo_profesional_tipo_id', this.resolucion.ttec_denominacion_titulo_profesional_tipo_id);
        data.append('numero', this.resolucion.numero);
        data.append('fecha', this.resolucion.fecha);
        data.append('descripcion', this.resolucion.descripcion);
        data.append('file', this.resolucion.archivo);
  
        axios.post(Servicio.getServe() + `carreraUni/resolucionCarrera`, data).then(response => {
          if (response.data.status == 'success') {
            console.log('Registrado')
            this.getResoluciones();
            this.modo = 'lista';
            this.uniAlert({
              color: 'success',
              text: 'Registro realizado exitosamente'
            });
          }
        }).catch(() => {
          this.uniAlert({
            color: 'error',
            text: 'Error al realizado exitosamente'
          });
        });
      }
    },
    edit(item){
      this.resolucion.id = item.id;
      this.resolucion.ttec_denominacion_titulo_profesional_tipo_id = item.ttec_denominacion_titulo_profesional_tipo_id;
      this.resolucion.descripcion = item.descripcion;
      this.resolucion.numero = item.numero;
      this.resolucion.fecha = item.fecha;
      this.resolucion.archivo = '';
      this.modo = 'editar';
    },
    update(){
      if (this.$refs.formRMC.validate()) {
        let data = new FormData();
        // data.append('ttec_institucioneducativa_carrera_autorizada_id', this.resolucion.id);
        data.append('numero', this.resolucion.numero);
        data.append('fecha', this.resolucion.fecha);
        data.append('descripcion', this.resolucion.descripcion);
        data.append('file', this.resolucion.archivo);

        axios.put(Servicio.getServe() + `carreraUni/resolucionCarrera/${this.resolucion.id}`, data).then(response => {
          if (response.data.status == 'success') {
            console.log('Registrado')
            this.getResoluciones();
            this.modo = 'lista';
            this.uniAlert({
              color: 'success',
              text: 'el registro fue actualizado correctamente'
            });
          }
        }).catch(() => {
          this.uniAlert({
            color: 'error',
            text: 'Error al realizar la actualización'
          });
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
          axios.delete(Servicio.getServe() + `carreraUni/resolucionCarrera/${id}`).then(response => {
            if (response.data.status == 'success') {
              console.log('Eliminado')
              this.getResoluciones();
              this.modo = 'lista';
              this.uniAlert({
                color: 'success',
                text: 'Registro eliminado correctamente'
              });
            }
          });
        }
      });
    },
  },
}
</script>