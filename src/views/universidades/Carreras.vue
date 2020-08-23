<template>
  <div>
    <Alerta :type="alerta.type" :text="alerta.text"/>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-forward</v-icon>
      </template>
    </v-breadcrumbs>
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
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-card>
              <v-card-title>
                {{mode}} Carrera
              </v-card-title>
              <v-card-text>
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
          </v-form>
        </v-dialog>
      </template>
    </v-card>

    <v-snackbar
      v-model="snack.state"
      :top="'top'"
      :right="'right'"
      :color="snack.color"
      :multi-line="snack.mode === 'multi-line'"
      :timeout="2500"
      :vertical="snack.mode === 'vertical'"
    >
      {{ snack.text }}
    </v-snackbar>
  </div>
</template>
<script>
  import axios from 'axios';
  import Alerta from '../../components/universidades/Alerta'

  export default {
    name: 'Carreras',
    components: {
      Alerta
    },
    data: () => ({
      alerta: {
        type: '',
        text: ''
      },
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/universidades/dashboard',
        },
        {
          text: 'Carreras',
          disabled: true,
          href: 'carreras',
        },
      ],
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
      snack: {
        state: false,
        color: "success",
        mode: "",
        timeout: 2500,
        text: ""
      }
    }),
    mounted(){
      this.getList();
    },
    methods: {
      showDialog(){
        this.mode = 'Crear';
        this.carrera = {
          id: '',
          nombre: ''
        };
        // this.$refs.form.reset();
        this.cDialog = true;
        // this.$refs.form.resetValidation();
      },
      getList(){
        axios.get('http://localhost:3000/carrera').then(response => {
          console.log(response);
          this.carreras = response.data.data;
        })
      },
      create(){
        if (this.$refs.form.validate()) {
          axios.post('http://localhost:3000/carrera', this.carrera).then(response => {
            if (response.data.status == 'success') {
              // this.$vToastify.success("Registro realizado correctamente");
              this.getList();
              this.cDialog = false;
              this.toast("success", "Registro realizado correctamente");
            }
          }).catch( () => {
            this.toast("error", "Ocurrio un error al realizar el registro");   
          }).finally( () => {
            this.cDialog = false;
          })  
        }
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
          this.$vToastify.warning("Complete el nombre");
          return;
        }

        // const Toast = this.$swal.({
        //   toast: true,
        //   position: 'top-end',
        //   showConfirmButton: false,
        //   timer: 3000,
        //   timerProgressBar: true,
        //   onOpen: (toast) => {
        //     toast.addEventListener('mouseenter', toast.stopTimer)
        //     toast.addEventListener('mouseleave', toast.resumeTimer)
        //   }
        // })

        axios.put('http://localhost:3000/carrera/'+this.carrera.id, this.carrera).then(response => {
          if (response.data.status == 'success') {
            this.getList();
            this.cDialog = false;
            this.$vToastify.success("Registro actualizado correctamente");
            // this.$vToastify.clientError("this will overwrite the body", "this will add a title");
            // this.$vToastify.info("Easy as that");
            // this.$vToastify.success("Registro realizado exitosamente","sdafsadf", { withBackdrop: true, backdrop: 'rgb(128, 0, 128)' });
            // this.$dialog.component('error', 'adsfasdf')
            // this.$vToastify.error("Registro realizado exitosamente","sdafsadf"); 
            // this.$vToastify.info("Registro realizado exitosamente"); 
            // this.$vToastify.warning("Registro realizado exitosamente","sdafsadf");
            // this.$swal({
            //   toast: true,
            //   position: 'top-end',
            //   icon: 'success',
            //   text: 'Registrado correctamente',
            //   showConfirmButton: false,
            //   timer: 2000,
            //   background: '#b6f0b4'
            // })
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
                this.$vToastify.success("Registro eliminado correctamente");
              }
            }).catch( () => {
              
            }).finally( () => {

            })
          }
        });
      },
      toast(mcolor, mtext) {
        this.snack.color = mcolor;
        this.snack.text = mtext;
        this.snack.state = true;
      },
    }
  }
</script>
<style scope>
  /* @import '@node_modules/vuetify/src/styles/main.sass'; */
</style>