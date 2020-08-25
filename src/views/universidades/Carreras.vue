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
          color="primary"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="showDialog()">Nueva carrera</v-btn>
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
                    color="primary"
                    label="Nombre de la Carrera"
                    v-model="carrera.nombre"
                    :rules="[v => !!v || 'El nombre es requerido']"
                    filled
                    @keyup.enter="(event) => event.preventDefault()"
                  ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="secondary"
                  @click="cDialog = false"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  @click="create"
                  v-show="mode == 'Crear'"
                >
                  Registrar
                </v-btn>
                <v-btn
                  color="primary"
                  @click="update"
                  v-show="mode == 'Editar'"
                >
                  Actualizar
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
      <v-icon v-if="snack.color == 'success'">mdi-check</v-icon>
      <v-icon v-if="snack.color == 'info'">mdi-information-outline</v-icon>
      <v-icon v-if="snack.color == 'warning'">mdi-alert-outline</v-icon>
      <v-icon v-if="snack.color == 'error'">mdi-information-outline</v-icon>
      {{ snack.text }}
    </v-snackbar>
  </div>
</template>
<script>
  import Servicio from '../../services/general'
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
      snack: {
        state: false,
        color: "success",
        mode: "",
        timeout: 3000,
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
        }
        this.cDialog = true;
        this.$refs.form.reset()
        // this.$refs.form.reset();
        // this.$refs.form.resetValidation();
      },
      getList(){
        axios.get(Servicio.getServe() + 'carrera').then(response => {
          console.log(response);
          this.carreras = response.data.data;
        })
      },
      create(){
        if (this.$refs.form.validate()) {
          axios.post(Servicio.getServe() + 'carrera', this.carrera).then(response => {
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
        if (this.$refs.form.validate()) {
          axios.put(Servicio.getServe() + 'carrera/'+this.carrera.id, this.carrera).then(response => {
            if (response.data.status == 'success') {
              this.getList();
              this.cDialog = false;
              this.toast("success", "Registro actualizado correctamente");
            }
          }).catch( () => {
            this.toast("error", "Ocurrio un error al actualizar el registro");
          }).finally( () => {
            this.cDialog = false;
          })
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
            axios.delete(Servicio.getServe() + 'carrera/'+id).then(response => {
              if (response.data.status == 'success') {
                this.getList();
                this.toast("success", "Registro eliminado correctamente");
              }
            }).catch( (e) => {
              if (e.response.status === 500) {
                this.toast("error", "Ocurrio un error al eliminar el registro");
              }else{
                this.toast("error", e.response.data.msg);
              }
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
</style>