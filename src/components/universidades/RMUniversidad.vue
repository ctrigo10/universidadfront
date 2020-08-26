<template>
  <span>
    <v-btn class="btn-accion" @click="rmdialog = true">
      <v-icon>mdi-file</v-icon>
    </v-btn>

    <v-dialog
      v-model="rmdialog"
      max-width="700px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>
          R.M. - {{universidad}}
        </v-card-title>
        <v-card-text>
          <v-btn color="primary" v-if="resoluciones.length == 0 && modo == 'lista'" @click="modo = 'crear'">Agregar</v-btn>
          <div v-show="modo == 'lista'">
            <v-row v-for="(item, index) in resoluciones" :key="index">
              <v-col cols="12" sm="5">
                Archivo PDF
              </v-col>
              <v-col cols="12" sm="5">
                <h5>Número</h5>
                <h5>Fecha</h5>
                <h5>Descripción</h5>
                <v-btn
                  color="primary"
                >
                  Editar
                </v-btn>
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
                          placeholder="aaa/mm/dd"
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
  name: 'rm-universidad',
  props: [
    'idUniversidad',
    'universidad'
  ],
  data: () => ({
    rmdialog: false,
    modo: 'lista',
    meni1: false,
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
      file: ''
    },
    resoluciones: [],
  }),
  mounted(){
    this.modo = 'lista';
    this.resolucion.idUniversidad = this.idUniversidad;
    this.getResoluciones();
  },
  methods: {
    closeDialog(){
      this.rmdialog = false;
    },
    getResoluciones(){
      // axios.get(`http://localhost:3000/carreraUni/resolucionCarrera/${this.idUniversidad}`).then(response => {
      //   this.resoluciones = response.data.data;
      //   console.log(this.resoluciones)
      // });
    },
    create(){
      if (this.$refs.formRMU.validate()) {
        let data = new FormData();
        data.append('descripcion', this.resolucion.descripcion);
        data.append('nro_resolucion', this.resolucion.nro_resolucion);
        data.append('fecha_resolucion', this.resolucion.fecha_resolucion);
        // data.append('iduniversidad', this.idUniversidad);
        data.append('file', this.resolucion.file);
  
        // axios.post(`http://localhost:3000/universidad/archivoNuevoRM`, data).then(response => {
        axios.put(`http://localhost:3000/universidad/archivoRM/${this.idUniversidad}`, data).then(response => {
          if (response.data.status == 'success') {
            console.log('Registrado')
            this.getResoluciones();
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
        data.append('iduniversidad', this.idUniversidad);
        data.append('file', this.resolucion.file);

        axios.put(`http://localhost:3000/carreraUni/archivoNuevoRM/${this.resolucion.id}`, data).then(response => {
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
          axios.delete(`http://localhost:3000/carreraUni/archivoNuevoRM/${id}`).then(response => {
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