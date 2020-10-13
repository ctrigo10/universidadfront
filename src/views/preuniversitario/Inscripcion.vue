<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Inscripción"></header-title>
      <v-row class="mb-6">
        <v-col cols="12" sm="12">
          <v-card>
            <v-card-text>
              Ingrese código RUDE.
              <v-form ref="iform">
                <v-row>
                  <v-col cols="12" sm="8" class="py-0">
                    <v-text-field
                      label="Código RUDE"
                      v-model="estudiante.codigo_rude"
                      :rules="[(v) => !!v || 'Campo requerido']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn
                      :loading="btn_loading"
                      color="primary"
                      @click="searchStudent"
                    >
                      <v-icon>mdi-magnify</v-icon>Buscar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="estudiante.nombre"
                    label="Nombres"
                    filled
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="estudiante.paterno"
                    label="Apellido paterno"
                    filled
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="estudiante.materno"
                    label="Apellido materno"
                    filled
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="estado == 'inscribirse'"
                  cols="12"
                  class="text-center"
                >
                  <v-btn large color="primary" @click="showConfirm">
                    <v-icon small>mdi-send</v-icon>
                    Inscribirse
                  </v-btn>
                </v-col>
              </v-row>
              <div v-if="estado == 'tabla'">
                <h3 class="teal--text my-2">Resultado de la Prueba</h3>
                <v-data-table
                  :headers="headers"
                  :items="respuestas"
                  :loading="loading"
                  calculate-widths
                  no-data-text="No existen registros"
                  no-results-text="Sin resultados"
                  item-key="name"
                  class="elevation-1"
                  v-cloak
                >
                  <template v-slot:item.estado="{ item }">
                    <td>
                      <span
                        v-if="
                          item.estado == 1 ||
                          item.estado == true ||
                          item.estado == 'true'
                        "
                      >
                        <v-chip small color="green lighten-4">activo</v-chip>
                      </span>
                      <span v-else>
                        <v-chip small color="red lighten-4">inactivo</v-chip>
                      </span>
                    </td>
                  </template>
                </v-data-table>
              </div>
              <div v-else-if="data_loading" class="text-center">
                <v-progress-circular indeterminate></v-progress-circular>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="cdialog" width="300">
      <v-card>
        <v-card-title class="headline grey lighten-3" primary-title>
          <span class="headline">Alerta</span>
        </v-card-title>
        <v-card-text>
          <p>¿Esta seguro(a) de realizar la inscripción?</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="send_loading"
            text
            @click="sendResult"
            >Aceptar</v-btn
          >
          <v-btn color="red" text @click="cdialog = false">Cancelar</v-btn>
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
      >{{ snack.text }}</v-snackbar
    >
  </div>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
import Service from "../../services/general";
import axios from "axios";
export default {
  name: "universidad",
  components: {
    HeaderTitle,
  },
  data: () => ({
    edialog: false,
    cdialog: false,
    loading: false,
    question_loading: false,
    data_loading: false,
    send_loading: false,
    btn_loading: false,
    server: "",
    estado: "",
    headers: [
      { text: "Nombre ", value: "nombre" },
      { text: "Paterno ", value: "paterno" },
      { text: "Materno ", value: "materno" },
      { text: "Estado ", value: "estado" },
    ],
    inscripcion: [],
    estudiante: {
      id: "",
      codigo_rude: "819813412008154",
      nombre: "",
      paterno: "",
      materno: "",
      ci: "",
      complemento: "",
    },
    cateory_id: 2,
    snack: {
      state: false,
      color: "success",
      text: "",
    },
  }),
  mounted() {
    this.server = Service.getServe();
  },
  computed: {},
  methods: {
    searchStudent() {
      if (this.$refs.iform.validate()) {
        this.btn_loading = true;
        this.estado = "";
        this.estudiante.preguntas = [];
        axios
          .post(
            Service.getBasePre() + "busca/estudiante",
            { codigo_rude: this.estudiante.codigo_rude },
            Service.getHeader()
          )
          .then((response) => {
            this.btn_loading = false;
            if (response.data.id > 0) {
              this.estudiante.id = response.data.id;
              this.estudiante.nombre = response.data.nombre;
              this.estudiante.paterno = response.data.paterno;
              this.estudiante.materno = response.data.materno;
              this.checkResponse(this.estudiante.codigo_rude);
            } else {
              this.toast("info", "Registro no encontrado");
            }
          })
          .catch((error) => {
            this.btn_loading = false;
            console.error("Error al cargar registros", error);
          });
      }
    },

    checkResponse(codigo_rude) {
      this.data_loading = true;
      axios
        .post(
          Service.getBasePre() + "check/inscripcion",
          { codigo_rude: codigo_rude },
          Service.getHeader()
        )
        .then((response) => {
          this.data_loading = false;
          if (response.data.message == "not") {
            this.estado = "inscribirse";
          } else {
            this.estado = "tabla";
            this.inscripcion = response.data.result;
          }
        })
        .catch((error) => {
          this.data_loading = false;
          console.error("Error al cargar registros", error);
        });
    },

    async showConfirm() {
      if (this.estudiante.nombre == "") {
        this.toast(
          "warning",
          "Ingrese el codigo RUDE para buscar y verificar sus datos."
        );
      } else {
        this.cdialog = true;
      }
    },

    sendResult() {
      this.send_loading = true;
      axios
        .post(
          Service.getBasePre() + "inscripcion",
          this.estudiante,
          Service.getHeader()
        )
        .then((response) => {
          this.send_loading = false;
          if (response.status === 201) {
            this.cdialog = false;
            this.toast("success", response.data.message);
            this.estado = "";
            this.checkResponse(this.estudiante.codigo_rude);
          } else if (response.status === 200) {
            this.toast("info", response.data.message);
          }
        })
        .catch((error) => {
          this.send_loading = false;
          console.error("Error, no se pudo guardar", error);
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