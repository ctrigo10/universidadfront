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
          <v-tabs
            color="purple"
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
            <v-card-text >
              <v-row>
                <v-col cols="12" sm="6" ma-1>
                  <v-text-field v-model="resolucion.nro_resolucion" label="Número" placeholder="" filled></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="resolucion.fecha_resolucion" label="Fecha" placeholder="" filled></v-text-field>
                </v-col>
              </v-row>
              <v-text-field v-model="resolucion.descripcion" label="Descripción" placeholder="" filled></v-text-field>
              <!-- <v-file-input accept="image/*" label="Archivo de la R.M." v-model="resolucion.file" filled></v-file-input> -->
              <v-file-input label="Archivo de la R.M." v-model="resolucion.file" filled></v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="purple accent-4"
                text
                @click="create"
                v-show="modo == 'crear'"
              >
                Registrar
              </v-btn>
              <v-btn
                color="purple accent-4"
                text
                @click="update"
                v-show="modo == 'editar'"
              >
                Actualizar
              </v-btn>
              <v-btn
                color="red"
                text
                @click="closeDialog"
              >
                Cancelar
              </v-btn>
            </v-card-actions>
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
      let data = new FormData();
      data.append('descripcion', this.resolucion.descripcion);
      data.append('nro_resolucion', this.resolucion.nro_resolucion);
      data.append('fecha_resolucion', this.resolucion.fecha_resolucion);
      data.append('iduniversidad', this.idUniversidad);
      data.append('file', this.resolucion.file);

      axios.post(`http://localhost:3000/universidad/archivoNuevoRM`, data).then(response => {
        if (response.data.status == 'success') {
          console.log('Registrado')
          this.getResoluciones();
          this.$vToastify.success("Registro realizado correctamente");
        }
      });
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