<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Habilitar Cursos"></header-title>
      <v-card-title>
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
        :items="cursos"
        :loading="loading"
        :search="search"
        calculate-widths
        no-data-text="No existen registros"
        no-results-text="Sin resultados"
        item-key="name"
        class="elevation-1"
        v-cloak
      >
        <template v-slot:item.fecha_inicio="{ item }">
          <td>
            {{ item.fecha_inicio | formatdate }}
          </td>
        </template>
        <template v-slot:item.fecha_fin="{ item }">
          <td>
            {{ item.fecha_fin | formatdate }}
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
            <span class="headline">Habilitar curso</span>
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
                    v-model="curso.descripcion"
                    :rules="[(v) => !!v || 'El campo es requerido']"
                    autocomplete="off"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="initDateFormat"
                        label="Fecha inicio *"
                        readonly
                        append-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                        :rules="[(v) => !!v || 'El campo es requerido']"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="curso.fecha_inicio"
                      no-title
                      @input="menu1 = false"
                      @change="getCheckDate"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="endDateFormat"
                        label="Fecha fin *"
                        readonly
                        append-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                        :rules="[(v) => !!v || 'El campo es requerido']"
                        :disabled="curso.fecha_inicio == ''"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="curso.fecha_fin"
                      :min="curso.fecha_inicio"
                      no-title
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    label="Tipo educación *"
                    :items="tipoeducacion"
                    v-model="curso.tipo_id"
                    item-text="descripcion"
                    item-value="id"
                    :rules="[(v) => !!v || 'Seleccione una opción']"
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
              @click.native="createCurso()"
              >Guardar</v-btn
            >
            <v-btn
              color="success"
              :loading="btn_loading"
              text
              v-show="!mode"
              @click.native="updateCurso()"
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
      <!-- <v-btn dark text @click="snack.state = false">Cerrar</v-btn> -->
    </v-snackbar>
  </div>
</template>
<script>
/* eslint-disable no-console */
import HeaderTitle from "@/components/HeaderTitle";
import Service from "../../services/general";
import axios from "axios";
export default {
  name: "habilitar-curso",
  components: {
    HeaderTitle,
  },
  data() {
    return {
      search: "",
      loading: false,
      btn_loading: false,
      menu1: false,
      menu2: false,
      headers: [
        { text: "#", value: "id", align: "left", sortable: false },
        { text: "Descripción ", value: "descripcion" },
        { text: "Fecha inicio ", value: "fecha_inicio" },
        { text: "Fecha fin ", value: "fecha_fin" },
        { text: "Acciones", value: "accion", sortable: false, width: "18%" },
      ],
      cursos: [],
      curso: {
        id: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        tipo_id: "",
      },
      tipoeducacion: [],
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
    // if (Service.getUser()) {
    this.estados = Service.getEstado();
    this.getHabilitarCursos();
    this.getTipoEducaciones();
    // }
  },
  computed: {
    initDateFormat() {
      return this.curso.fecha_inicio == ""
        ? ""
        : this.formatDate(this.curso.fecha_inicio);
    },
    endDateFormat() {
      return this.curso.fecha_fin == ""
        ? ""
        : this.formatDate(this.curso.fecha_fin);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    getCheckDate() {
      if (
        this.curso.fecha_inicio > this.curso.fecha_fin &&
        this.curso.fecha_fin != ""
      ) {
        this.curso.fecha_fin = this.curso.fecha_inicio;
      }
    },
    getTipoEducaciones() {
      axios
        .get(Service.getBasePre() + "tipo/educacion", Service.getHeader())
        .then((response) => {
          this.tipoeducacion = response.data;
        })
        .catch((error) => {
          console.error("Error al cargar registros", error);
        });
    },
    getHabilitarCursos() {
      this.loading = true;
      axios
        .get(Service.getBasePre() + "habilitar/cursos", Service.getHeader())
        .then((response) => {
          this.loading = false;
          this.cursos = response.data;
        })
        .catch((error) => {
          this.loading = false;
          console.error("Error al cargar registros", error);
        });
    },
    showDialog() {
      this.curso = {
        id: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        tipo_id: "",
        estado: true,
      };
      this.mode = true;
      this.mdialog = true;
    },
    createCurso() {
      if (this.$refs.form.validate()) {
        this.btn_loading = true;
        axios
          .post(
            Service.getBasePre() + "habilitar/curso",
            this.curso,
            Service.getHeader()
          )
          .then(() => {
            this.btn_loading = false;
            this.toast("success", "Registro guardado");
            this.mdialog = false;
            this.getHabilitarCursos();
          })
          .catch(() => {
            this.btn_loading = false;
            this.toast("error", "No se pudo guardar");
          });
      }
    },

    editItem(data) {
      this.curso = data;
      this.mode = false;
      this.mdialog = true;
    },

    updateCurso() {
      if (this.$refs.form.validate()) {
        this.btn_loading = true;
        axios
          .put(
            Service.getBasePre() + "habilitar/curso/" + this.curso.id,
            this.curso,
            Service.getHeader()
          )
          .then(() => {
            this.btn_loading = false;
            this.toast("success", "Registro actualizado");
            this.mdialog = false;
            this.getHabilitarCursos();
          })
          .catch(() => {
            this.btn_loading = false;
            this.toast("error", "No se pudo actualizar");
          });
      }
    },

    confirmItem(id) {
      this.curso.id = id;
      this.mconfirm = true;
    },

    deleteItem() {
      this.btn_loading = true;
      axios
        .delete(
          Service.getBasePre() + "habilitar/curso/" + this.curso.id,
          Service.getHeader()
        )
        .then(() => {
          this.btn_loading = false;
          this.toast("success", "Registro eliminado");
          this.mconfirm = false;
          this.getHabilitarCursos();
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
