<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h4>Formulario 1</h4>
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
      <v-card>
        <v-card-text class="formulario-datos">
          <FormHeader title="FC-01 FORMULARIO DE VERIFICACIÓN DE DOCUMENTOS PARA LA AUTORIZACIÓN DE LA COMPLEMENTARIEDAD DE MODALIDADES DE ATENCIÓN"/>
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
                  <th>REQUISITOS</th>
                  <th>Si / No</th>
                  <th colspan="2">OBSERVACIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-width"> <b>1.1. NOTA DE SOLICITUD</b>: Dirigido al Ministerio de Educación, Deportes y Culturas conteniendo lo siguiente:</td>
                  <td>
                    <v-radio-group v-model="formulario.req11" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td colspan="2">
                    <v-textarea v-model="formulario.req11obs" rows="2"></v-textarea>
                  </td>
                </tr>
                <tr>
                  <td class="text-width"> <b>1.2.</b> Solicitud de implementación de la complementariedad de modalidades de atención educativa, especificando si es para Sede o Subsede.</td>
                  <td>
                    <v-radio-group v-model="formulario.req12" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td colspan="2">
                    <v-textarea v-model="formulario.req12obs" rows="2"></v-textarea>
                  </td>
                </tr>
                <tr>
                  <td class="text-width"> <b>1.3.</b> Innovación curricular.</td>
                  <td>
                    <v-radio-group v-model="formulario.req13" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td colspan="2">
                    <v-textarea v-model="formulario.req13obs" rows="2"></v-textarea>
                  </td>
                </tr>
                <tr>
                  <td class="text-width"> <b>1.4.</b> Recursos educativos para la modalidad a distancia</td>
                  <td>
                    <v-radio-group v-model="formulario.req14" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td colspan="2">
                    <v-textarea v-model="formulario.req14obs" rows="2"></v-textarea>
                  </td>
                </tr>
                <tr>
                  <td class="text-width"> <b>1.5.</b> Plataforma educativa para la modalidad virtual</td>
                  <td>
                    <v-radio-group v-model="formulario.req15" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td colspan="2">
                    <v-textarea v-model="formulario.req15obs" rows="2"></v-textarea>
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>DOCUMENTOS LEGALES</th>
                  <th>Si / No</th>
                  <th>Nro. De autorización</th>
                  <th>Fecha de autorización</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-width"> <b>2.1.</b> Fotocopia simple Resolución Ministerial de autorización sede</td>
                  <td>
                    <v-radio-group v-model="formulario.doc21" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td>
                    <v-text-field v-model="formulario.doc21_nro_autorizacion" class="control-width"></v-text-field>
                  </td>
                  <td>
                    <v-menu
                      v-model="calendario1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="100px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="formulario.doc21_fecha_autorizacion"
                          label="Fecha"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="formulario.doc21_fecha_autorizacion"
                        @input="calendario1 = false"
                      ></v-date-picker>
                    </v-menu>
                  </td>
                </tr>
                <tr>
                  <td class="text-width"> <b>2.2.</b> Fotocopia simple Resolución Ministerial de autorización subsede</td>
                  <td>
                    <v-radio-group v-model="formulario.doc22" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td>
                    <v-text-field v-model="formulario.doc22_nro_autorizacion" class="control-width"></v-text-field>
                  </td>
                  <td>
                    <v-menu
                      v-model="calendario2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="100px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="formulario.doc22_fecha_autorizacion"
                          label="Fecha"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="formulario.doc22_fecha_autorizacion"
                        @input="calendario2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </td>
                </tr>
                <tr>
                  <td class="text-width"> <b>2.3.</b> Fotocopia simple Resolución Ministerial Programas académicos pregrado</td>
                  <td>
                    <v-radio-group v-model="formulario.doc23" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td>
                    <v-text-field v-model="formulario.doc23_nro_autorizacion" class="control-width"></v-text-field>
                  </td>
                  <td>
                    <v-menu
                      v-model="calendario3"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="100px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="formulario.doc23_fecha_autorizacion"
                          label="Fecha"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="formulario.doc23_fecha_autorizacion"
                        @input="calendario3 = false"
                      ></v-date-picker>
                    </v-menu>
                  </td>
                </tr>
                <tr>
                  <td class="text-width"> <b>2.4.</b> Fotocopia simple Resolución Ministerial de aprobación rediseño curricular</td>
                  <td>
                    <v-radio-group v-model="formulario.doc24" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td>
                    <v-text-field v-model="formulario.doc24_nro_autorizacion" class="control-width"></v-text-field>
                  </td>
                  <td>
                    <v-menu
                      v-model="calendario4"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="100px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="formulario.doc24_fecha_autorizacion"
                          label="Fecha"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="formulario.doc24_fecha_autorizacion"
                        @input="calendario4 = false"
                      ></v-date-picker>
                    </v-menu>
                  </td>
                </tr>
                <tr>
                  <td class="text-width"> <b>2.5.</b> Fotocopia simple Resolución Ministerial Programas académicos posgrado</td>
                  <td>
                    <v-radio-group v-model="formulario.doc25" row>
                      <v-radio label="Si" :value="true"></v-radio>
                      <v-radio label="No" :value="false"></v-radio>
                    </v-radio-group>
                  </td>
                  <td>
                    <v-text-field v-model="formulario.doc25_nro_autorizacion" class="control-width"></v-text-field>
                  </td>
                  <td>
                    <v-menu
                      v-model="calendario5"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="100px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="formulario.doc25_fecha_autorizacion"
                          label="Fecha"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="formulario.doc25_fecha_autorizacion"
                        @input="calendario5 = false"
                      ></v-date-picker>
                    </v-menu>
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
    </v-dialog>

  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import FormHeader from '@/components/universidades/formularios/FormHeader'
import { mapMutations } from 'vuex'
export default {
  name: 'universidad-form1',
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
      req11: true,
      req11obs: "",
      req11revision: true,
      req11revision_obs: "",
      req12: true,
      req12obs: "",
      req12revision: true,
      req12revision_obs: "",
      req13: true,
      req13obs: "",
      req13revision: true,
      req13revision_obs: "",
      req14: true,
      req14obs: "",
      req14revision: true,
      req14revision_obs: "",
      req15: true,
      req15obs: "",
      req15revision: true,
      req15revision_obs: "",
      doc21: true,
      doc21_nro_autorizacion: "",
      doc21_fecha_autorizacion: "",
      doc21revision: true,
      doc21revision_obs: "",
      doc22: true,
      doc22_nro_autorizacion: "",
      doc22_fecha_autorizacion: "",
      doc22revision: true,
      doc22revision_obs: "",
      doc23: true,
      doc23_nro_autorizacion: "",
      doc23_fecha_autorizacion: "",
      doc23revision: true,
      doc23revision_obs: "",
      doc24: true,
      doc24_nro_autorizacion: "",
      doc24_fecha_autorizacion: "",
      doc24revision: true,
      doc24revision_obs: "",
      doc25: true,
      doc25_nro_autorizacion: "",
      doc25_fecha_autorizacion: "",
      doc25revision: true,
      doc25revision_obs: "",
      estado: "creado"
    },
    dialogForm: false,
    calendario1: false,
    calendario2: false,
    calendario3: false,
    calendario4: false,
    calendario5: false,
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
        let response = await UniversidadesService.getListForm1(this.idUniversidad)
        let data = response.data
        if (data.status == 'success') {
          console.log('form1-data',data.data)
          this.formularios = data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    resetearFormulario(){
      this.formulario.id = '';
      this.formulario.institucioneducativa_id = '';
      this.formulario.representante = '';
      this.formulario.localidad = '';
      this.formulario.req11 = true;
      this.formulario.req11obs = "";
      this.formulario.req11revision = true;
      this.formulario.req11revision_obs = "";
      this.formulario.req12 = true;
      this.formulario.req12obs = "";
      this.formulario.req12revision = true;
      this.formulario.req12revision_obs = "";
      this.formulario.req13 = true;
      this.formulario.req13obs = "";
      this.formulario.req13revision = true;
      this.formulario.req13revision_obs = "";
      this.formulario.req14 = true;
      this.formulario.req14obs = "";
      this.formulario.req14revision = true;
      this.formulario.req14revision_obs = "";
      this.formulario.req15 = true;
      this.formulario.req15obs = "";
      this.formulario.req15revision = true;
      this.formulario.req15revision_obs = "";
      this.formulario.doc21 = true;
      this.formulario.doc21_nro_autorizacion = "";
      this.formulario.doc21_fecha_autorizacion = "";
      this.formulario.doc21revision = true;
      this.formulario.doc21revision_obs = "";
      this.formulario.doc22 = true;
      this.formulario.doc22_nro_autorizacion = "";
      this.formulario.doc22_fecha_autorizacion = "";
      this.formulario.doc22revision = true;
      this.formulario.doc22revision_obs = "";
      this.formulario.doc23 = true;
      this.formulario.doc23_nro_autorizacion = "";
      this.formulario.doc23_fecha_autorizacion = "";
      this.formulario.doc23revision = true;
      this.formulario.doc23revision_obs = "";
      this.formulario.doc24 = true;
      this.formulario.doc24_nro_autorizacion = "";
      this.formulario.doc24_fecha_autorizacion = "";
      this.formulario.doc24revision = true;
      this.formulario.doc24revision_obs = "";
      this.formulario.doc25 = true;
      this.formulario.doc25_nro_autorizacion = "";
      this.formulario.doc25_fecha_autorizacion = "";
      this.formulario.doc25revision = true;
      this.formulario.doc25revision_obs = "";
      this.formulario.estado = "creado";
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
        let response = await UniversidadesService.createForm1(this.formulario)
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
      this.resetearFormulario()
      this.formulario.id = item.id;
      this.formulario.institucioneducativa_id = item.institucioneducativa_id;
      this.formulario.representante = item.representante;
      this.formulario.localidad = item.localidad;
      this.formulario.req11 = item.req11;
      this.formulario.req11obs = item.req11obs;
      this.formulario.req11revision = item.req11revision;
      this.formulario.req11revision_obs = item.req11revision_obs;
      this.formulario.req12 = item.req12;
      this.formulario.req12obs = item.req12obs;
      this.formulario.req12revision = item.req12revision;
      this.formulario.req12revision_obs = item.req12revision_obs;
      this.formulario.req13 = item.req13;
      this.formulario.req13obs = item.req13obs;
      this.formulario.req13revision = item.req13revision;
      this.formulario.req13revision_obs = item.req13revision_obs;
      this.formulario.req14 = item.req14;
      this.formulario.req14obs = item.req14obs;
      this.formulario.req14revision = item.req14revision;
      this.formulario.req14revision_obs = item.req14revision_obs;
      this.formulario.req15 = item.req15;
      this.formulario.req15obs = item.req15obs;
      this.formulario.req15revision = item.req15revision;
      this.formulario.req15revision_obs = item.req15revision_obs;
      this.formulario.doc21 = item.doc21;
      this.formulario.doc21_nro_autorizacion = item.doc21_nro_autorizacion;
      this.formulario.doc21_fecha_autorizacion = item.doc21_fecha_autorizacion;
      this.formulario.doc21revision = item.doc21revision;
      this.formulario.doc21revision_obs = item.doc21revision_obs;
      this.formulario.doc22 = item.doc22;
      this.formulario.doc22_nro_autorizacion = item.doc22_nro_autorizacion;
      this.formulario.doc22_fecha_autorizacion = item.doc22_fecha_autorizacion;
      this.formulario.doc22revision = item.doc22revision;
      this.formulario.doc22revision_obs = item.doc22revision_obs;
      this.formulario.doc23 = item.doc23;
      this.formulario.doc23_nro_autorizacion = item.doc23_nro_autorizacion;
      this.formulario.doc23_fecha_autorizacion = item.doc23_fecha_autorizacion;
      this.formulario.doc23revision = item.doc23revision;
      this.formulario.doc23revision_obs = item.doc23revision_obs;
      this.formulario.doc24 = item.doc24;
      this.formulario.doc24_nro_autorizacion = item.doc24_nro_autorizacion;
      this.formulario.doc24_fecha_autorizacion = item.doc24_fecha_autorizacion;
      this.formulario.doc24revision = item.doc24revision;
      this.formulario.doc24revision_obs = item.doc24revision_obs;
      this.formulario.doc25 = item.doc25;
      this.formulario.doc25_nro_autorizacion = item.doc25_nro_autorizacion;
      this.formulario.doc25_fecha_autorizacion = item.doc25_fecha_autorizacion;
      this.formulario.doc25revision = item.doc25revision;
      this.formulario.doc25revision_obs = item.doc25revision_obs;
      // this.formulario.estado = item.estado;

      this.modo = 'editar'
      this.dialogForm = true
    },
    async actualizarFormulario() {
      try {
        let response = await UniversidadesService.updateForm1(this.formulario.id, this.formulario)
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
            let response = await UniversidadesService.deleteForm1(idItem)
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