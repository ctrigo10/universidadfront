<template>
  <span>
    <v-btn class="btn-accion" @click="rmdialog = true">
      <v-icon>mdi-file</v-icon>
    </v-btn>

    <v-dialog
      v-model="rmdialog"
      max-width="900px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>
          R.M. - {{universidad}} - {{idUniversidadCarrera}}
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
                  <v-btn class="btn-accion">
                    <v-icon>mdi-file</v-icon>
                  </v-btn>
                <v-btn @click="edit(item)" class="btn-accion">
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn class="btn-accion" @click="deleted(item.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
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
                          v-model="resolucion.fecha"
                          label="Fecha Decreto Supremo"
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
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="resolucion.ttec_regimen_estudio_tipo_id"
                      :items="regimenesEstudio"
                      item-text="regimen_estudio"
                      item-value="id"
                      label="Régimen de Estudio"
                      placeholder="Seleccionar..."
                      filled
                      @change="cambiarLabel"
                      :rules="[v => !!v || 'El régimen de estudio es requerido']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="resolucion.tiempo_estudio" 
                      :label="labelTiempoEstudio" 
                      placeholder="" 
                      filled
                      :rules="[v => !!v || 'El tiempo de estudio es requerido']"
                    ></v-text-field>
                    <!-- <v-text-field v-model="resolucion.carga_horaria" label="Carga Horaria" placeholder="" filled></v-text-field> -->
                  </v-col>
                </v-row>
                <v-text-field v-model="resolucion.descripcion" label="Descripción" placeholder="" filled></v-text-field>
                <!-- <v-file-input accept="image/*" label="Archivo de la R.M." v-model="resolucion.file" filled></v-file-input> -->
                <v-file-input
                  label="Archivo de la R.M." 
                  v-model="resolucion.file" 
                  filled
                  :rules="[v => !!v || 'El archivo es requerido']"
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
import axios from 'axios'
export default {
  name: 'rm-carrera',
  props: [
    'idUniversidadCarrera',
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
      { text: 'Régimen de Estudio', value: 'regimen_estudio'},
      { text: 'Tiempo de estudio', value: 'tiempo_estudio'},
      // { text: 'Carga Horaria', value: 'carga_horaria'},
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
    ],
    resolucion: {
      id: '',
      ttec_institucioneducativa_carrera_autorizada_id: '',
      ttec_regimen_estudio_tipo_id: '',
      descripcion: '',
      numero: '',
      fecha: '',
      tiempo_estudio: '',
      carga_horaria: '',
      file: ''
    },
    resoluciones: [],
    regimenesEstudio: [],
    labelTiempoEstudio: 'Tiempo de estudio'
  }),
  mounted(){
    this.modo = 'lista';
    this.resolucion.ttec_institucioneducativa_carrera_autorizada_id = this.idUniversidadCarrera;
    this.getResoluciones();
    this.getRegimenesEstudio();
  },
  methods: {
    closeDialog(){
      this.rmdialog = false;
    },
    getResoluciones(){
      axios.get(`http://localhost:3000/carreraUni/resolucionCarrera/${this.idUniversidadCarrera}`).then(response => {
        this.resoluciones = response.data.data;
        console.log(this.resoluciones)
      });
    },
    getRegimenesEstudio(){
      axios.get(`http://localhost:3000/carreraUni/regimenEstudio/list`).then(response => {
        this.regimenesEstudio = response.data.data;
      });
    },
    cambiarLabel(){
      // si es anual
      if (this.resolucion.ttec_regimen_estudio_tipo_id == 1) {
        this.labelTiempoEstudio = 'Tiempo de estudio en años';
      }else{
        this.labelTiempoEstudio = 'Tiempo de estudio en semestres';
      }
    },
    create(){
      if (this.$refs.formRMC.validate()) {
        let data = new FormData();
        data.append('ttec_institucioneducativa_carrera_autorizada_id', this.idUniversidadCarrera);
        data.append('ttec_regimen_estudio_tipo_id', this.resolucion.ttec_regimen_estudio_tipo_id);
        data.append('descripcion', this.resolucion.descripcion);
        data.append('numero', this.resolucion.numero);
        data.append('fecha', this.resolucion.fecha);
        data.append('tiempo_estudio', this.resolucion.tiempo_estudio);
        data.append('carga_horaria', 0);
        data.append('file', this.resolucion.file);
  
        axios.post(`http://localhost:3000/carreraUni/resolucionCarrera`, data).then(response => {
          if (response.data.status == 'success') {
            console.log('Registrado')
            this.getResoluciones();
            this.$vToastify.success("Registro realizado correctamente");
          }
        });
      }
    },
    edit(item){
      this.resolucion.id = item.id;
      this.resolucion.ttec_institucioneducativa_carrera_autorizada_id = item.ttec_institucioneducativa_carrera_autorizada_id;
      this.resolucion.ttec_regimen_estudio_tipo_id = item.ttec_regimen_estudio_tipo_id;
      this.resolucion.descripcion = item.descripcion;
      this.resolucion.numero = item.numero;
      this.resolucion.fecha = item.fecha;
      this.resolucion.tiempo_estudio = item.tiempo_estudio;
      this.resolucion.carga_horaria = item.carga_horaria;
      this.resolucion.file = '';

      this.modo = 'editar';
    },
    update(){
      if (this.$refs.formRMC.validate()) {
        let data = new FormData();
        data.append('ttec_institucioneducativa_carrera_autorizada_id', this.idUniversidadCarrera);
        data.append('ttec_regimen_estudio_tipo_id', this.resolucion.ttec_regimen_estudio_tipo_id);
        data.append('descripcion', this.resolucion.descripcion);
        data.append('numero', this.resolucion.numero);
        data.append('fecha', this.resolucion.fecha);
        data.append('tiempo_estudio', this.resolucion.tiempo_estudio);
        data.append('carga_horaria', this.resolucion.carga_horaria);
        data.append('file', this.resolucion.file);

        axios.put(`http://localhost:3000/carreraUni/resolucionCarrera/${this.resolucion.id}`, data).then(response => {
          if (response.data.status == 'success') {
            console.log('Registrado')
            this.getResoluciones();
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
          axios.delete(`http://localhost:3000/carreraUni/resolucionCarrera/${id}`).then(response => {
            if (response.data.status == 'success') {
              console.log('Eliminado')
              this.getResoluciones();
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