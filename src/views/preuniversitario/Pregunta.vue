<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Test Preguntas"></header-title>
      <v-card-title>
        <v-flex xs12 sm3>
          <v-select
            label="Seleccione categoría"
            :items="categorias"
            v-model="pregunta.categoria_id"
            item-text="descripcion"
            item-value="id"
            @change="getPreguntas(pregunta.categoria_id)"
          ></v-select>
        </v-flex>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="showDialog()">
          <v-icon>mdi-plus</v-icon>Nuevo
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="preguntas"
        :loading="loading"
        :search="search"
        calculate-widths
        no-data-text="No existen registros"
        no-results-text="Sin resultados"
        item-key="name"
        class="elevation-1"
        v-cloak
      >
        <template v-slot:item.imagen="{ item }">
          <td>
            <span v-if="item.tipo == 2">
              <img :src="serve + 'images/preguntas/' + item.imagen" />
            </span>
            <span v-else> - </span>
          </td>
        </template>
        <template v-slot:item.estado="{ item }">
          <td>
            <span
              v-if="
                item.estado == 1 || item.estado == true || item.estado == 'true'
              "
            >
              <v-chip small color="green lighten-4">activo</v-chip>
            </span>
            <span v-else>
              <v-chip small color="red lighten-4">inactivo</v-chip>
            </span>
          </td>
        </template>
        <template v-slot:item.accion="{ item }">
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="success"
                  @click="editItem(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  dark
                  color="red"
                  @click="confirmItem(item.id)"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-close-box</v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </td>
        </template>
      </v-data-table>
    </v-container>
    <v-dialog v-model="mdialog" scrollable max-width="500px">
      <v-form ref="form">
        <v-card>
          <v-card-title class="headline grey lighten-3" primary-title>
            <span class="headline">Pregunta</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <span class="text--darken-8 grey--text">
              Los campos con
              <b class="red--text">*</b> son requeridos.
            </span>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    type="text"
                    label="Descripción *"
                    v-model="pregunta.descripcion"
                    :rules="[(v) => !!v || 'El campo es requerido']"
                    autocomplete="off"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    label="Tipo(texto o imagen)"
                    :items="tipos"
                    v-model="pregunta.tipo"
                    item-text="descripcion"
                    item-value="id"
                    :rules="[(v) => !!v || 'Seleccione una opción']"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    label="Estado"
                    :items="estados"
                    v-model="pregunta.estado"
                    item-text="descripcion"
                    item-value="id"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              :loading="btn_loading"
              text
              v-show="mode"
              @click.native="createPregunta()"
              >Guardar</v-btn
            >
            <v-btn
              color="success"
              :loading="btn_loading"
              text
              v-show="!mode"
              @click.native="updatePregunta()"
              >Actualizar</v-btn
            >
            <v-btn color="red" text @click.native="mdialog = false"
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="mconfirm" width="300">
      <v-card>
        <v-card-title class="headline grey lighten-3" primary-title>
          <span class="headline">Alerta</span>
        </v-card-title>
        <v-card-text>
          <p>¿Esta seguro(a) de eliminar el registro?</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="btn_loading"
            text
            @click="deleteItem()"
            >Aceptar</v-btn
          >
          <v-btn color="red" text @click="mconfirm = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snack.state"
      top="top"
      right="right"
      rounded="pill"
      :color="snack.color"
      timeout="2500"
    >
      {{ snack.text }}
    </v-snackbar>
  </div>
</template>
<script>
/* eslint-disable no-console */
import HeaderTitle from "@/components/HeaderTitle";
import Service from "../../services/general";
import axios from "axios";
export default {
  name: "pregunta",
  components: {
    HeaderTitle,
  },
  data() {
    return {
      search: "",
      loading: false,
      btn_loading: false,
      headers: [
        { text: "Descripción ", value: "descripcion" },
        { text: "Imagen ", value: "imagen" },
        { text: "Estado ", value: "estado" },
        { text: "Acciones", value: "accion", sortable: false, width: "18%" },
      ],
      categorias: [],
      preguntas: [],
      pregunta: {
        id: "",
        categoria_id: "",
        descripcion: "",
        imagen: "",
        tipo: "",
        estado: "",
      },
      estados: [],
      tipos: [],
      serve: "",
      mdialog: false,
      mconfirm: false,
      mode: true,
      snack: {
        state: false,
        color: "success",
        text: "",
      },
    };
  },
  mounted() {
    let user = Service.getUser();
    let role_id = user
      ? user.roles.findIndex(
          (item) => item.rol_tipo_id == Service.rolePreuniversitario()
        )
      : -1;
    if (user && role_id >= 0) {
      this.serve = Service.getServe();
      this.estados = Service.getEstado();
      this.tipos = [
        { id: 1, descripcion: "Texto" },
        { id: 2, descripcion: "Texto e imagen" },
      ];
      this.getCategorias();
    } else {
      this.$router.replace({ name: "pre-escritorio" });
    }
  },
  methods: {
    getCategorias() {
      axios
        .get(Service.getBasePre() + "categorias/activo", Service.getHeader())
        .then((response) => {
          this.categorias = response.data;
          if (this.categorias.length > 0) {
            this.pregunta.categoria_id = this.categorias[0].id;
            this.getPreguntas(this.pregunta.categoria_id);
          }
        })
        .catch((error) => {
          console.error("Error al cargar registros", error);
        });
    },
    getPreguntas(categoria_id) {
      this.loading = true;
      axios
        .get(
          Service.getBasePre() + "preguntas/" + categoria_id,
          Service.getHeader()
        )
        .then((response) => {
          this.loading = false;
          this.preguntas = response.data;
        })
        .catch((error) => {
          this.loading = false;
          console.error("Error al cargar registros", error);
        });
    },
    showDialog() {
      if (this.pregunta.categoria_id == "") {
        this.toast("warning", "Seleccione la categoría");
      } else {
        this.pregunta.id = "";
        this.pregunta.descripcion = "";
        this.pregunta.imagen = "";
        this.pregunta.tipo = "";
        this.pregunta.estado = true;
        if (this.$refs.form) this.$refs.form.resetValidation();
        this.mode = true;
        this.mdialog = true;
      }
    },
    createPregunta() {
      if (this.$refs.form.validate()) {
        this.btn_loading = true;
        axios
          .post(
            Service.getBasePre() + "pregunta",
            this.pregunta,
            Service.getHeader()
          )
          .then(() => {
            this.btn_loading = false;
            this.toast("success", "Registro guardado");
            this.mdialog = false;
            this.getPreguntas(this.pregunta.categoria_id);
          })
          .catch(() => {
            this.btn_loading = false;
            this.toast("error", "No se pudo guardar");
          });
      }
    },

    editItem(data) {
      this.pregunta = data;
      this.mode = false;
      this.mdialog = true;
    },

    updatePregunta() {
      if (this.$refs.form.validate()) {
        this.btn_loading = true;
        axios
          .put(
            Service.getBasePre() + "pregunta/" + this.pregunta.id,
            this.pregunta,
            Service.getHeader()
          )
          .then(() => {
            this.btn_loading = false;
            this.toast("success", "Registro actualizado");
            this.mdialog = false;
            this.getPreguntas(this.pregunta.categoria_id);
          })
          .catch(() => {
            this.btn_loading = false;
            this.toast("error", "No se pudo actualizar");
          });
      }
    },

    confirmItem(id) {
      this.pregunta.id = id;
      this.mconfirm = true;
    },

    deleteItem() {
      this.btn_loading = true;
      axios
        .delete(
          Service.getBasePre() + "pregunta/" + this.pregunta.id,
          Service.getHeader()
        )
        .then(() => {
          this.btn_loading = false;
          this.toast("success", "Registro eliminado");
          this.mconfirm = false;
          this.getPreguntas(this.pregunta.categoria_id);
        })
        .catch(() => {
          this.btn_loading = false;
          this.toast("error", "Registro en uso o no existente");
        });
    },

    toast(mcolor, mtext) {
      this.snack.color = mcolor;
      this.snack.text = mtext;
      this.snack.state = true;
    },
  },
};
</script>
