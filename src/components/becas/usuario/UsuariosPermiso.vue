<template>
  <v-card>
    <v-card-title primary-title> Seleccionar usuario </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="4">
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
              v-for="(item, index) in usuarios"
              :key="index"
              @click="seleccionarUsuario(item)"
              :class="{ 'text-danger': !item.usuario_esactivo }"
            >
              <v-list-item-avatar>
                <v-avatar size="50px">
                  <img
                    src="../../../assets/user.svg"
                    alt="John"
                    class="uni-avatar"
                  />
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="item.nombre" m-0></v-list-item-title>
                <v-list-item-subtitle
                  v-html="'Rol: ' + item.rol"
                ></v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-chip class="ma-2" color="success" text-color="white" small>
                    Rol Activo
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" sm="8">
          <v-card>
            <v-card-title primary-title> Permisos </v-card-title>
            <v-card-text>
              <p v-if="usuarioSeleccionado == ''">
                Debe seleccionar un usuario ...
              </p>
              <div v-if="usuarioSeleccionado != ''">
                <div>
                  <v-alert dense type="info" outlined>
                    El usuario
                    <strong>{{ usuarioSeleccionado.nombre }} </strong>
                    puede gestionar la información de las siguientes
                    universidades
                  </v-alert>
                  <br />
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
                    :items="usuarioSeleccionado.universidades"
                    hide-default-footer
                  >
                    <template v-slot:[`item.acciones`]="{ item }">
                      <v-icon v-if="item" color="blue"
                        >mdi-checkbox-marked</v-icon
                      >
                    </template>
                  </v-data-table>

                  <div class="text-right">
                    <br />
                    <v-btn color="secondary" @click="editPermisos"
                      >Actualizar permisos</v-btn
                    >
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog
      v-model="dialogPermisos"
      max-width="700px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title> Actualizar permisos </v-card-title>
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
            :headers="headers1"
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
          <v-btn color="primary" @click="cancelar()">Cancelar</v-btn>
          <v-btn
            color="secondary"
            :loading="loading"
            :disabled="loading"
            @click="actualizarPermisos()"
            >Actualizar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  props: ["usuarios_todos", "universidades"],
  data: () => ({
    loader: null,
    loading: false,
    nombreBuscar: "",
    usuarios: [],
    usuarioSeleccionado: "",
    search: "",
    universidadesSeleccionadas: [],
    dialogPermisos: false,
    edited_index: 0,
    headers: [
      // { text: '#', sortable: false, value: 'id'},
      { text: "", value: "acciones", sortable: false, align: "end" },
      { text: "Universidad", value: "institucioneducativa" },
      { text: "Sede/Sub sede", value: "sede" },
    ],
    headers1: [
      // { text: '#', sortable: false, value: 'id'},
      { text: "", value: "acciones", sortable: false, align: "end" },
      { text: "Universidad", value: "institucioneducativa" },
      {
        text: "Sede/Sub sede",
        value: "institucioneducativa_dato.nombre_sede_subsede",
      },
    ],
  }),
  mounted() {
    this.usuarios = this.usuarios_todos;
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 2000);
      this.loader = null;
    },
  },
  methods: {
      ...mapActions(["agregarUniversidadesUsuario", "alert"]),
    buscarUsuarios() {
      this.usuarios = this.usuarios_todos.filter((usuario) =>
        usuario.nombre.includes(this.nombreBuscar.toUpperCase())
      );
      console.log(this.usuarios);
    },
    seleccionarUsuario(item) {
      this.edited_index = this.usuarios.indexOf(item);
      this.usuarioSeleccionado = item;
      this.universidadesSeleccionadas = [];
      this.usuarioSeleccionado.universidades.forEach((item) => {
        this.universidadesSeleccionadas.push(item.id);
      });
    },
    editPermisos() {
      this.dialogPermisos = true;
    },
    cancelar() {
      //this.obtenerUniversidadesUsuario();
      this.dialogPermisos = false;
    },
    async actualizarPermisos() {
      try {
        this.loader = "loading";
        await this.agregarUniversidadesUsuario({
          usuario_rol_id: this.usuarioSeleccionado.usuario_rol_id,
          universidades: this.universidadesSeleccionadas,
          index: this.edited_index,
        });
        this.alert({
          text: "Registros guardados",
          color: "primary",
        });
      } catch (error) {
        let texto = error;
        if (error.response) texto = error.response.data;
        this.alert({
          text: texto,
          color: "red",
        });
      }
      this.dialogPermisos = false;
    },
  },
};
</script>