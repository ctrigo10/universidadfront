<template>
<v-app>
  <!-- <h1>Carreras</h1> -->
  <!-- <v-container>
    <v-row justify="end">
        <v-btn color="primary" dark @click="showDialog()">Crear</v-btn>
    </v-row>
  </v-container> -->

  <template>
    <v-card>
      <v-card-title>
        Listado de carreras
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn class="" color="purple" small outlined dark @click="showDialog()"><v-icon>mdi-plus-outline</v-icon></v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="carreras"
        :search="search"
        locale="ES"
      >
        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn class="mx-1" icon small color="default" @click="edit(item)">
            <v-icon dark color="purple">mdi-square-edit-outline</v-icon>
          </v-btn>
          <v-btn class="mx-1" icon small color="default" @click="deleted(item.id)">
            <v-icon dark color="purple">mdi-close-box-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </template>

  <template>
    <v-dialog
      v-model="cDialog"
      width="500"
    >
      <v-card>
        <v-card-title>
          {{mode}} Carrera
        </v-card-title>

        <v-card-text>
          <template>
            <v-form>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Nombre de la Carrera"
                    v-model="carrera.nombre"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="cDialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="secondary"
            text
            @click="create"
            v-show="mode == 'Crear'"
          >
            Registrar
          </v-btn>
          <v-btn
            color="secondary"
            text
            @click="update"
            v-show="mode == 'Editar'"
          >
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
</v-app>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'Carreras',
    data: () => ({
      headers: [
        { text: '#', sortable: false, value: 'id'},
        { text: 'Nombre', value: 'nombre'},
        { text: 'Acciones', value: 'acciones', sortable: false}
      ],
      carreras: [],
      search: '',
      cDialog: false,
      mode: '',
      carrera: {
        id: '',
        nombre: ''
      }
    }),
    mounted(){
      this.getList();
    },
    methods: {
      showDialog(){
        this.mode = 'Crear';
        this.carrera.nombre = '';
        this.cDialog = true;
      },
      getList(){
        axios.get('http://localhost:3000/carrera').then(response => {
          console.log(response);
          this.carreras = response.data.data;
        })
      },
      create(){
        if(this.carrera.nombre == ''){
          alert('complete el nombre')
          return;
        }

        axios.post('http://localhost:3000/carrera', this.carrera).then(response => {
          if (response.data.status == 'success') {
            alert('Carrera registrada');
            this.getList();
            this.cDialog = false;
          }
        }).catch( () => {
          
        }).finally( () => {
          this.cDialog = false;
        })
      },
      edit(item){
        this.mode = 'Editar';
        this.carrera = {
          id: item.id,
          nombre: item.nombre
        };
        this.cDialog = true;
      },
      update(){
        if(this.carrera.nombre == ''){
          alert('complete el nombre')
          return;
        }

        axios.put('http://localhost:3000/carrera/'+this.carrera.id, this.carrera).then(response => {
          if (response.data.status == 'success') {
            alert('Carrera actualizada');
            this.getList();
            this.cDialog = false;
          }
        }).catch( () => {
          
        }).finally( () => {
          this.cDialog = false;
        })
      },
      deleted(id){
        alert('eliminando '+id);
        axios.delete('http://localhost:3000/carrera/'+id).then(response => {
          if (response.data.status == 'success') {
            alert('Carrera eliminada');
            this.getList();
            this.cDialog = false;
          }
        }).catch( () => {
          
        }).finally( () => {
          this.cDialog = false;
        })
      }
    }
  }
</script>
<style scope>
  /* @import '@node_modules/vuetify/src/styles/main.sass'; */
</style>