<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Permisos de usuario
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              name="name"
              label="Buscar usuario por nombre"
              id="id"
              append-icon="mdi-magnify"
              v-model="nombreBuscar"
              @keyup="buscarUsuarios"
            ></v-text-field>
            <v-list v-model="usuarioSeleccionado">  
              <v-list-item
                v-for="(item, index) in usuarios" :key="index"
                @click="seleccionarUsuario(item)"
                :disabled="!item.usuario_esactivo"
                :class="{'text-danger': !item.usuario_esactivo }"
              >
                <v-list-item-avatar>
                  <v-avatar size="50px">
                    <img
                      src="../../assets/user.svg"
                      alt="John"
                      class="uni-avatar"
                    >
                  </v-avatar>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-html="item.nombre + ' ' + item.paterno + ' ' + item.materno" m-0 ></v-list-item-title>
                  <v-list-item-subtitle v-html="'Rol: '+item.rol_tipo"></v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <div v-if="item.usuario_esactivo">
                      <v-chip
                        class="ma-2"
                        color="success"
                        text-color="white"
                        v-if="item.rol_esactivo"
                        small
                      >
                        Rol Activo
                      </v-chip>
                      <v-chip
                        class="ma-2"
                        color="red"
                        text-color="white"
                        v-if="!item.rol_esactivo"
                        small
                      >
                        Rol Inactivo
                      </v-chip>
                    </div>
                    <div v-else>
                      <v-chip
                        class="ma-2"
                        color="grey"
                        text-color="white"
                        small
                      >
                        Usuario Inactivo
                      </v-chip>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col
            cols="12"
            sm="8"
          >

            <h3 class="text-center">Permisos</h3>
            <p v-if="usuarioSeleccionado == ''">Debe seleccionar un usuario ...</p>
            <div v-if="usuarioSeleccionado != ''">
              <v-alert
                outlined
                type="success"
                text
                v-if="usuarioSeleccionado.rol_tipo_id != 51"
              >
                El usuario seleccionado tiene permisos sobre todas las Universidades.
              </v-alert>
              <div v-else>
                <h5 class="text-center">{{usuarioSeleccionado.nombre}} {{usuarioSeleccionado.paterno}} {{usuarioSeleccionado.materno}}</h5>
                <br>
                <!-- <v-chip
                  v-for="(item, index) in universidadesPermiso" :key="index"
                  class="ma-2"
                  color="grey"
                  text-color="white"
                >
                  {{ item.institucioneducativa }}
                </v-chip> -->

                <v-data-table
                  :headers="headers"
                  :items="universidadesPermiso"
                  hide-default-footer
                >
                  <template v-slot:[`item.acciones`]="{ item }">
                    <v-icon v-if="item" color="blue">mdi-checkbox-marked</v-icon>
                  </template>
                </v-data-table>
                
                <div class="text-right">
                  <br>
                  <v-btn color="primary" @click="editPermisos">Actualizar permisos</v-btn>
                </div>

              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="dialogPermisos"
      max-width="700px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Actualizar permisos
        </v-card-title>
        <v-card-text>
          <div>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar universidad"
              single-line
              hide-details
              color="primary"
            ></v-text-field>
          </div>
          <v-data-table
            :headers="headers"
            :items="universidades"
            :search="search"
          >
            <template v-slot:[`item.acciones`]="{ item }">
              <v-checkbox
                v-model="universidadesSeleccionadas"
                color="info"
                :value="item.id"
                hide-details
                class="mt-0"
              ></v-checkbox>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="cancelar()">Cancelar</v-btn>
          <v-btn color="primary" @click="actualizarPermisos()">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import { mapMutations } from 'vuex';
export default {
  name: 'usuario-permiso',
  data: () => ({
    checked: true,
    nombreBuscar: '',
    usuarios: [],
    usuarioSeleccionado: '',
    universidadesPermiso: [],
    dialogPermisos: false,
    universidades: [],
    headers: [
      // { text: '#', sortable: false, value: 'id'},
      { text: '', value: 'acciones', sortable: false, align: 'end'},
      { text: 'Universidad', value: 'institucioneducativa'},
      { text: 'Departamento', value: 'departamento.depa'},
      { text: 'Dependencia', value: 'dependencia'},
    ],
    search: '',
    universidadesSeleccionadas: []
  }),
  mounted(){
    this.obtenerUsuarios();
    this.obtenerUniversidadesActivas();
  },
  methods: {
    ...mapMutations(['uniAlert']),
    async obtenerUsuarios(){
      try {
        let response = await UniversidadesService.getUsuarios();
        let data = await response.data;
        this.usuarios = [];
        data.data.forEach(item => {
          if (item.rol_tipo_id == 51) {
            this.usuarios.push(item);
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    seleccionarUsuario(item){
      this.usuarioSeleccionado = item;
      this.obtenerUniversidadesUsuario();
    },
    async buscarUsuarios(){
      try {
        if (this.nombreBuscar == '') {
          this.obtenerUsuarios();
        }else{
          let response = await UniversidadesService.buscarUsuarioNombre(this.nombreBuscar);
          let data = await response.data;
          this.usuarios = [];
          data.data.forEach(item => {
            if (item.rol_tipo_id == 51) {
              this.usuarios.push(item);
            }
          })
        }
      } catch (error) {
        console.log(error);
      }
    },
    async obtenerUniversidadesUsuario(){
      try {
        let response = await UniversidadesService.getUniversidadesUsuario(this.usuarioSeleccionado.usuario_id);
        let data = await response.data;
        this.universidadesPermiso = data.data;

        this.universidadesSeleccionadas = [];
        this.universidadesPermiso.forEach(item => {
          this.universidadesSeleccionadas.push(item.universidad_id); 
        })

        console.log(this.universidadesPermiso);
      } catch (error) {
        console.log(error);
      }
    },
    editPermisos(){
      this.dialogPermisos = true;
    },
    async obtenerUniversidadesActivas(){
      try {
        let response = await UniversidadesService.getUniversidadesActivas();
        let data = await response.data;
        this.universidades = data.data;
        console.log('activas', this.universidades)
      } catch (error) {
        console.log(error);
      }
    },
    cancelar(){
      this.obtenerUniversidadesUsuario();
      this.dialogPermisos = false;
    },
    agregarQuitarUniversidad(idUniversidad){
      let indice = this.universidadesSeleccionadas.indexOf(idUniversidad);
      if (indice !== -1 ) {
        // si existe el id lo eliminamos
        this.universidadesSeleccionadas.splice(indice, 1);
      }else{
        // si no existe el id lo agregamos
        this.universidadesSeleccionadas.push(idUniversidad);
      }
      console.log(this.universidadesSeleccionadas);
    },
    async actualizarPermisos(){
      try {
        if (this.universidadesSeleccionadas.length == 0 ) {
          this.uniAlert({ color: 'error', text: 'Debe seleccionar por lo menos una universidad' });
        }else{
          let datos = {
            userid: this.usuarioSeleccionado.usuario_id,
            universidades: this.universidadesSeleccionadas
          }
          let response = await UniversidadesService.actualizarPermisosUniversidadUsuario(datos);
          let data = await response.data;
          if (data.status == 'success') {
            this.uniAlert({ color: 'success', text: 'Permisos actualizados correctamente' });
            this.obtenerUniversidadesUsuario();
            this.dialogPermisos = false;
          }
        }
      } catch (error) {
        console.log(error);
        this.uniAlert({ color: 'error', text: 'Error al actualizar los permisos' });
      }
    }
  }
}
</script>

<style>
  .text-danger {
    /* color: red; */
    /* text-decoration: line-through; */
    /* opacity: 0.4; */
  }
</style>