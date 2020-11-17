<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h4>Formulario 5</h4>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openDialog">Nuevo</v-btn>
      </v-card-title>
      <v-card-text>
        <div class="">
          <v-text-field
            v-model="search"
            label="Buscar"
            append-icon="mdi-magnify"
          ></v-text-field>
        </div>
        <v-data-table
          :headers="headers"
          :items="formularios"
          :search="search"
        >
          <template v-slot:[`item.estado`]="{ item }">
            <v-chip :color="item.estado == 'creado' ? 'gray' : 'success'" v-text="item.estado"></v-chip>
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <v-btn @click="editarFormulario(item)" color="secondary" x-small class="mr-1">
              <v-icon x-small class="mr-1">mdi-pencil-outline</v-icon> Editar
            </v-btn>
            <v-btn @click="eliminarFormulario(item.id)" color="error" x-small class="mr-1">
              <v-icon x-small class="mr-1">mdi-delete</v-icon> Eliminar
            </v-btn>
            <v-btn @click="enviarFormulario(item)" color="info" x-small>
              <v-icon x-small class="mr-1">mdi-send-outline</v-icon> Enviar
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="dialogForm"
      scrollable 
      max-width="1200px"
    >
      <v-form ref="form">
        <v-card>
          <v-card-text class="formulario-datos">
            <FormHeader title="FC-05 FORMULARIO DE VERIFICACIÓN Y EVALUACIÓN DE PLATAFORMAS EDUCATIVAS PARA LA SEMIPRESENCIAL"/>
            <v-row>
              <v-col cols="12" lg="3" md="3" sm="4" xs="12">Universidad:</v-col>
              <v-col cols="12" lg="9" md="9" sm="8" xs="12" v-text="universidad.institucioneducativa"></v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="3" md="3" sm="4" xs="12">Representante:</v-col>
              <v-col cols="12" lg="9" md="9" sm="8" xs="12"><v-text-field v-model="formulario.representante" label="Representante"></v-text-field></v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="3" md="3" sm="4" xs="12" v-text=" universidad.id == universidad.sede ? 'Sede:' : 'Subsede:'"></v-col>
              <v-col cols="12" lg="9" md="9" sm="8" xs="12" v-text="universidad.nombre_sede_subsede"></v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="3" md="3" sm="4" xs="12">Departamento</v-col>
              <v-col cols="12" lg="9" md="9" sm="8" xs="12" v-text="universidad.deparmento"></v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="3" md="3" sm="4" xs="12">Localidad:</v-col>
              <v-col cols="12" lg="9" md="9" sm="8" xs="12"><v-text-field v-model="formulario.localidad" label="Localidad"></v-text-field></v-col>
            </v-row>

            <v-simple-table>
              <!-- <template v-slot:default> -->
                <thead>
                  <tr>
                    <th colspan="2"></th>
                    <th colspan="3">COMBINA (se debe indicar las modalidades a utilizar)</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>MODALIDAD</th>
                    <th>INDICADORES</th>
                    <th>Presencial</th>
                    <th>Virtual</th>
                    <th>A distancia</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>SEMI PRESENCIAL</td>
                    <td>De acuerdo a los recursos presentados por cada universidad</td>
                    <td>
                      <v-checkbox
                        v-model="formulario.presencial"
                        color="success"
                        hide-details
                      ></v-checkbox>
                    </td>
                    <td>
                      <v-checkbox
                        v-model="formulario.virtual"
                        color="success"
                        hide-details
                      ></v-checkbox>
                    </td>
                    <td>
                      <v-checkbox
                        v-model="formulario.distancia"
                        color="success"
                        hide-details
                      ></v-checkbox>
                    </td>
                    <td>
                      <v-textarea v-model="formulario.observaciones" rows="2"></v-textarea>
                    </td>
                  </tr>
                </tbody>
              <!-- </template> -->
            </v-simple-table>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="closeDialog">Cancelar</v-btn>
            <v-btn v-if="modo == 'crear'" color="primary" @click="registrarFormulario">Registrar</v-btn>
            <v-btn v-if="modo == 'editar'" color="primary" @click="actualizarFormulario">Actualizar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import FormHeader from '@/components/universidades/formularios/FormHeader'
import { mapMutations } from 'vuex'
export default {
  name: 'universidad-form5',
  components: {
    FormHeader
  },
  props: ['idUniversidad','universidad'],
  data: () => ({
    headers: [
      {text: 'ID', value: 'id'},
      {text: 'Estado', value: 'estado'},
      {text: 'Fecha', value: 'fecha_registro'},
      {text: 'Representante', value: 'representante'},
      {text: 'Localidad', value: 'localidad'},
      {text: 'Gestión', value: 'gestion'},
      {text: 'Universidad', value: 'institucioneducativa_id'},
      {text: 'Acciones', value: 'acciones'},
    ],
    search: '',
    formularios: [],
    formulario: {
      id: '',
      institucioneducativa_id: '',
      representante: '',
      localidad: '',
      modalidad: false,
      modalidad_virtual: false,
      modalidad_distancia: false,
      observaciones: '',
      revision: true,
      revision_obs: '',
      estado: 'creado',
      presencial: false,
      virtual: false,
      distancia: false
    },
    dialogForm: false,
    modo: ''
  }),
  mounted(){
    this.getFormularios()
    this.formulario.institucioneducativa_id = this.idUniversidad
    console.log(this.universidad)
  },
  watch: {
    idUniversidad: function(){
      this.getFormularios()
    }
  },
  methods: {
    ...mapMutations(['uniAlert']),
    async getFormularios() {
      try {
        let response = await UniversidadesService.getListForm5(this.idUniversidad)
        let data = response.data
        if (data.status == 'success') {
          this.formularios = data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    resetearFormulario(){
      this.formulario.id = '';
      this.formulario.representante = '';
      this.formulario.localidad = '';
      this.formulario.modalidad = false;
      this.formulario.observaciones = '';
      this.formulario.presencial = false;
      this.formulario.virtual = false;
      this.formulario.distancia = false;
      this.formulario.estado = 'creado';
      this.formulario.revision = true;
      this.formulario.revision_obs = '';
    },
    openDialog() {
      this.resetearFormulario()
      this.modo = 'crear'
      this.dialogForm = true
    },
    closeDialog(){
      this.dialogForm = false
    },
    async registrarFormulario() {
      try {
        let response = await UniversidadesService.createForm5(this.formulario)
        let data = response.data
        if (data.status == 'success') {
          this.getFormularios()
          this.uniAlert({color: 'success', text: 'Formulario registrado correctamente'})
          this.dialogForm = false
        }else{
          this.uniAlert({color: 'error', text: 'Error al registrar el formulario'})
        }
      } catch (error) {
        console.log(error)
        this.uniAlert({color: 'error', text: 'Error en el servidor'})
      }
    },
    editarFormulario(item){
      this.formulario.id = item.id;
      this.formulario.representante = item.representante;
      this.formulario.localidad = item.localidad;
      this.formulario.modalidad =  item.modalidad;
      this.formulario.observaciones = item.observaciones;
      this.formulario.presencial = item.presencial;
      this.formulario.virtual = item.virtual;
      this.formulario.distancia = item.distancia;
      this.formulario.revision = item.revision;
      this.formulario.revision_obs = item.revision_obs;

      this.modo = 'editar'
      this.dialogForm = true
    },
    async actualizarFormulario() {
      try {
        let response = await UniversidadesService.updateForm5(this.formulario.id, this.formulario)
        let data = response.data
        if (data.status == 'success') {
          this.getFormularios()
          this.uniAlert({color: 'success', text: 'Formulario actualizado correctamente'})
          this.dialogForm = false
        }else{
          this.uniAlert({color: 'error', text: 'Error al actualizar el formulario'})
        }
      } catch (error) {
        console.log(error)
        this.uniAlert({color: 'error', text: 'Error en el servidor'})
      }
    },
    eliminarFormulario(idItem) {
      try {
        this.$swal({
          title: '¿Eliminar?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.value) {
            let response = await UniversidadesService.deleteForm5(idItem)
            let data = response.data
            if (data.status == 'success') {
              this.getFormularios()
              this.uniAlert({color: 'success', text: 'Formulario eliminado correctamente'})
            }else{
              this.uniAlert({color: 'error', text: 'Error al eliminar el formulario'})
            }
          }
        });
      } catch (error) {
        console.log(error)
        this.uniAlert({color: 'error', text: 'Error en el servidor'})
      }
    },
    enviarFormulario(item) {
      console.log(item)
    }
  }
}
</script>

<style>
  .formulario-datos {
    font-size: 14px;
  }
  .text-width {
    max-width: 500px;
  }
  .control-width {
    max-width: 110px;
  }
</style>