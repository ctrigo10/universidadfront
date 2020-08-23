<template>
  <div>
    <v-row>
      <v-col cols="12" sm="9">
        <v-select
          :items="unidadesAcademicas"
          item-value="id"
          item-text="unidad_academica"
          v-model="unidadSeleccionada"
          label="Unidad académica"
          placeholder="Seleccionar..."
          filled
          @change="seleccionarUA"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-btn class="btn-accion" @click="openNewDialog"> <v-icon>mdi-plus</v-icon> </v-btn>
        <v-btn class="btn-accion" @click="openAdminDialog"> <v-icon>mdi-cog</v-icon> </v-btn>
      </v-col>
    </v-row>
    <v-dialog
      v-model="newDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Agregar Unidad Académica
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Nombre"
            placeholder="Nombre de la unidad académica"
            filled
            v-model="unidadAcademica.unidad_academica"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="purple accent-4"
            text
            @click="create"
          >
            Registrar
          </v-btn>
          <v-btn
            color="red"
            text
            @click="newDialog = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="editDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Editar Unidad Académica
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Nombre"
            placeholder="Nombre de la unidad académica"
            filled
            v-model="unidadAcademica.unidad_academica"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="purple accent-4"
            text
            @click="update"
          >
            Actualizar
          </v-btn>
          <v-btn
            color="red"
            text
            @click="editDialog = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="adminDialog"
      max-width="700px"
    >
      <v-card>
        <v-card-title>
          Unidades Académicas
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn color="purple accent-4" outlined @click="openNewDialog">Agregar</v-btn>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="unidadesAcademicas"
            :search="search"
          >
            <template v-slot:[`item.acciones`]="{ item }">
              <v-btn @click="edit(item)" class="btn-accion">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn class="btn-accion" @click="deleted(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'unidad-academica',
  props: ['idUniversidad'],
  data: () => ({
    newDialog: false,
    editDialog: false,
    adminDialog: false,
    search: '',
    headers: [
      { text: 'Unidad Académica', value: 'unidad_academica'},
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
    ],
    unidadesAcademicas: [],
    unidadAcademica: {
      id: '',
      institucioneducativa_id: '',
      unidad_academica: ''
    },
    unidadSeleccionada: ''
  }),
  mounted(){
    this.getUnidadesAcademicas();
    this.unidadAcademica.institucioneducativa_id = this.idUniversidad;
  },
  methods: {
    openNewDialog(){
      this.unidadAcademica.unidad_academica = '';
      this.newDialog = true;
    },
    openAdminDialog(){
      this.adminDialog = true;
    },
    getUnidadesAcademicas(){
      axios.get(`http://localhost:3000/carreraUni/unidad/list/${this.idUniversidad}`).then(response => {
        this.unidadesAcademicas = response.data.data;
      })
    },
    create(){
      axios.post(`http://localhost:3000/carreraUni/unidad`, this.unidadAcademica).then(response => {
        if (response.data.status == 'success') {
          this.getUnidadesAcademicas();
          this.newDialog = false;
        }
      }).catch(() => {
        console.log('Error al registrar')
      })
    },
    edit(item){
      this.unidadAcademica.id = item.id;
      this.unidadAcademica.institucioneducativa_id = item.institucioneducativa_id;
      this.unidadAcademica.unidad_academica = item.unidad_academica;
      this.editDialog = true;
    },
    update(){
      axios.put(`http://localhost:3000/carreraUni/unidad/${this.unidadAcademica.id}`, this.unidadAcademica).then(response => {
        if (response.data.status == 'success') {
          this.getUnidadesAcademicas();
          this.editDialog = false;
        }
      }).catch(() => {
        console.log('Error al actualizar')
      })
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
          axios.delete(`http://localhost:3000/carreraUni/unidad/${id}`).then(response => {
            if (response.data.status == 'success') {
              console.log('Eliminado')
              this.getUnidadesAcademicas();
            }
          });
        }
      });
    },
    seleccionarUA(){
      this.$emit('seleccionarUA', this.unidadSeleccionada);
    }
  }
}
</script>