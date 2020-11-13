<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h4>Formulario 3</h4>
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
            <v-btn @click="editarFormulario(item)" color="secondary" small>
              <v-icon small>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn @click="eliminarFormulario(item.id)" color="error" small>
              <v-icon small>mdi-delete</v-icon>
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
            <FormHeader title="FC-03 FORMULARIO DE VERIFICACIÓN Y EVALUACIÓN DE RECURSOS EDUCATIVOS PARA LA MODALIDAD A DISTANCIA"/>
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
                    <th>PRESENTA</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>MODALIDAD</th>
                    <th>INDICADORES</th>
                    <th>Si / No</th>
                    <th>OBSERVACIONES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowspan="6">A DISTANCIA</td>
                    <td>Recursos impresos</td>
                    <td>
                      <v-radio-group v-model="formulario.ind_pres1" row>
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                      </v-radio-group>
                    </td>
                    <td>
                      <v-textarea v-model="formulario.ind_pres1_obs" rows="2"></v-textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>Recursos audiovisuales</td>
                    <td>
                      <v-radio-group v-model="formulario.ind_pres2" row>
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                      </v-radio-group>
                    </td>
                    <td>
                      <v-textarea v-model="formulario.ind_pres2_obs" rows="2"></v-textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>Recursos informáticos</td>
                    <td>
                      <v-radio-group v-model="formulario.ind_pres3" row>
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                      </v-radio-group>
                    </td>
                    <td>
                      <v-textarea v-model="formulario.ind_pres3_obs" rows="2"></v-textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>Recursos telemáticos</td>
                    <td>
                      <v-radio-group v-model="formulario.ind_pres4" row>
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                      </v-radio-group>
                    </td>
                    <td>
                      <v-textarea v-model="formulario.ind_pres4_obs" rows="2"></v-textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>Recursos multimedia</td>
                    <td>
                      <v-radio-group v-model="formulario.ind_pres5" row>
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                      </v-radio-group>
                    </td>
                    <td>
                      <v-textarea v-model="formulario.ind_pres5_obs" rows="2"></v-textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>Otros</td>
                    <td>
                      <v-radio-group v-model="formulario.ind_pres6" row>
                        <v-radio label="Si" :value="true"></v-radio>
                        <v-radio label="No" :value="false"></v-radio>
                      </v-radio-group>
                    </td>
                    <td>
                      <v-textarea v-model="formulario.ind_pres6_obs" rows="2"></v-textarea>
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
  name: 'universidad-form3',
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
      institucioneducativa_id: 95240019,
      representante: '',
      localidad: '',
      ind_pres1: true,
      ind_pres1_obs: '',
      ind_pres1revision: true,
      ind_pres1revision_obs: '',
      ind_pres2: true,
      ind_pres2_obs: '',
      ind_pres2revision: true,
      ind_pres2revision_obs: '',
      ind_pres3: true,
      ind_pres3_obs: '',
      ind_pres3revision: true,
      ind_pres3revision_obs: '',
      ind_pres4: true,
      ind_pres4_obs: '',
      ind_pres4revision: true,
      ind_pres4revision_obs: '',
      ind_pres5: true,
      ind_pres5_obs: '',
      ind_pres5revision: true,
      ind_pres5revision_obs: '',
      ind_pres6: true,
      ind_pres6_obs: '',
      ind_pres6revision: true,
      ind_pres6revision_obs: ''
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
        let response = await UniversidadesService.getListForm3(this.idUniversidad)
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
      this.formulario.ind_pres1 = true;
      this.formulario.ind_pres1_obs = '';
      this.formulario.ind_pres1revision = true;
      this.formulario.ind_pres1revision_obs = '';
      this.formulario.ind_pres2 = true;
      this.formulario.ind_pres2_obs = '';
      this.formulario.ind_pres2revision = true;
      this.formulario.ind_pres2revision_obs = '';
      this.formulario.ind_pres3 = true;
      this.formulario.ind_pres3_obs = '';
      this.formulario.ind_pres3revision = true;
      this.formulario.ind_pres3revision_obs = '';
      this.formulario.ind_pres4 = true;
      this.formulario.ind_pres4_obs = '';
      this.formulario.ind_pres4revision = true;
      this.formulario.ind_pres4revision_obs = '';
      this.formulario.ind_pres5 = true;
      this.formulario.ind_pres5_obs = '';
      this.formulario.ind_pres5revision = true;
      this.formulario.ind_pres5revision_obs = '';
      this.formulario.ind_pres6 = true;
      this.formulario.ind_pres6_obs = '';
      this.formulario.ind_pres6revision = true;
      this.formulario.ind_pres6revision_obs = '';
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
        let response = await UniversidadesService.createForm3(this.formulario)
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
      this.formulario.ind_pres1 = item.ind_pres1;
      this.formulario.ind_pres1_obs = item.ind_pres1_obs;
      this.formulario.ind_pres1revision = item.ind_pres1revision;
      this.formulario.ind_pres1revision_obs = item.ind_pres1revision_obs;
      this.formulario.ind_pres2 = item.ind_pres2;
      this.formulario.ind_pres2_obs = item.ind_pres2_obs;
      this.formulario.ind_pres2revision = item.ind_pres2revision;
      this.formulario.ind_pres2revision_obs = item.ind_pres2revision_obs;
      this.formulario.ind_pres3 = item.ind_pres3;
      this.formulario.ind_pres3_obs = item.ind_pres3_obs;
      this.formulario.ind_pres3revision = item.ind_pres3revision;
      this.formulario.ind_pres3revision_obs = item.ind_pres3revision_obs;
      this.formulario.ind_pres4 = item.ind_pres4;
      this.formulario.ind_pres4_obs = item.ind_pres4_obs;
      this.formulario.ind_pres4revision = item.ind_pres4revision;
      this.formulario.ind_pres4revision_obs = item.ind_pres4revision_obs;
      this.formulario.ind_pres5 = item.ind_pres5;
      this.formulario.ind_pres5_obs = item.ind_pres5_obs;
      this.formulario.ind_pres5revision = item.ind_pres5revision;
      this.formulario.ind_pres5revision_obs = item.ind_pres5revision_obs;
      this.formulario.ind_pres6 = item.ind_pres6;
      this.formulario.ind_pres6_obs = item.ind_pres6_obs;
      this.formulario.ind_pres6revision = item.ind_pres6revision;
      this.formulario.ind_pres6revision_obs = item.ind_pres6revision_obs;
      // this.formulario.estado = item.estado;

      this.modo = 'editar'
      this.dialogForm = true
    },
    async actualizarFormulario() {
      try {
        let response = await UniversidadesService.updateForm3(this.formulario.id, this.formulario)
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
            let response = await UniversidadesService.deleteForm3(idItem)
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