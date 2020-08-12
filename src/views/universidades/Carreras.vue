<template>
  <v-card class="tarjeta">
    <v-card-title>
      Carreras
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
        color="purple accent-4"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="purple accent-4" dark @click="showDialog()">Nueva carrera</v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="carreras"
        :search="search"
        locale="es"
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
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-row>
                <v-col>
                <v-text-field
                  type="text"
                  color="blue"
                  filled
                  label="Nombre de la Carrera"
                  v-model="carrera.nombre"
                  :rules="nameRules"
                  required
                ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="purple accent-4"
              text
              @click="create"
              v-show="mode == 'Crear'"
            >
              Registrar
            </v-btn>
            <v-btn
              color="purple accent-4"
              text
              @click="update"
              v-show="mode == 'Editar'"
            >
              Actualizar
            </v-btn>
            <v-btn
              color="red"
              text
              @click="cDialog = false"
            >
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-card>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'Carreras',
    data: () => ({
      headers: [
        // { text: '#', sortable: false, value: 'id'},
        { text: 'Nombre', value: 'nombre'},
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
      ],
      carreras: [],
      search: '',
      cDialog: false,
      mode: '',
      valid: true,
      carrera: {
        id: '',
        nombre: ''
      },
      nameRules: [
        v => !!v || 'El nombre es requerido',
      ],
    }),
    mounted(){
      this.getList();
    },
    methods: {
      showDialog(){
        this.mode = 'Crear';
        this.carrera.nombre = '';
        this.cDialog = true;
        this.$refs.form.reset();
        // this.$refs.form.resetValidation();
      },
      getList(){
        axios.get('http://localhost:3000/carrera').then(response => {
          console.log(response);
          this.carreras = response.data.data;
        })
      },
      create(){
        this.$refs.form.validate();
        if(!this.valid){
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
        // this.$refs.form.resetValidation();
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
        this.$swal({
          title: '¿Eliminar?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            axios.delete('http://localhost:3000/carrera/'+id).then(response => {
              if (response.data.status == 'success') {
                this.getList();
              }
            }).catch( () => {
              
            }).finally( () => {

            })
          }
        });
      }
    }
  }
</script>
<style scope>
  /* @import '@node_modules/vuetify/src/styles/main.sass'; */
</style>