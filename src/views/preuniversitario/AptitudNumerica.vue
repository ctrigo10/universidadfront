<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Aptitud Numérica"></header-title>
      <v-row class="mb-6">
        <v-col cols="12" sm="12">
          <v-card>
            <v-card-text>
              Ingrese código RUDE.
              <v-form ref="sform">
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
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="estudiante.paterno"
                    label="Apellido paterno"
                    filled
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="estudiante.materno"
                    label="Apellido materno"
                    filled
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <div v-if="estado == 'preguntas'">
                <p>
                  Esta prueba consta de 54 preguntas y tiene por finalidad
                  analizar tu capacidad de cálculo, utilizando las cuatro operaciones fundamentales: suma, resta, multiplicación y división. Ejecuta las operaciones siempre en el orden que aparecen: el primer número con el segundo, y el resultado con el tercer número. Ahora observa los ejemplos:
                  <v-btn small dark color="grey" @click="edialog = true"
                    >Ejemplos</v-btn
                  >
                </p>
                <h3 class="teal--text my-2">Preguntas (30 minutos)</h3>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    v-for="(pregunta, idx) in estudiante.preguntas"
                    :key="idx"
                  >
                    <div>
                      <span class="title">{{ pregunta.descripcion }}</span>
                      <v-radio-group v-model="pregunta.respuesta">
                        <v-radio
                          v-for="(oitem,
                          jdx) in pregunta.preuniversitario_opcions"
                          :key="jdx"
                          :label="oitem.opcion"
                          :value="jdx"
                        ></v-radio>
                      </v-radio-group>
                    </div>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn large color="primary" @click="showConfirm">
                      <v-icon small>mdi-send</v-icon>
                      Enviar
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <div v-else-if="estado == 'tabla'">
                <h3 class="teal--text my-2">Resultado de la Prueba</h3>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Nombre</th>
                        <th class="text-left">Paterno</th>
                        <th class="text-left">Materno</th>
                        <th class="text-center">Aciertos (#)</th>
                        <th class="text-center">Porcentaje (%)</th>
                        <th class="text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in respuestas" :key="index"
                      >
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.paterno }}</td>
                        <td>{{ item.materno }}</td>
                        <td class="text-center">{{ item.acierto }}</td>
                        <td class="text-center">{{ item.porcentaje }}</td>
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
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
              <div v-else-if="data_loading" class="text-center">
                <v-progress-circular indeterminate></v-progress-circular>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="edialog" scrollable width="500">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <p class="pt-4">
                <b>Ejemplo 1.</b> 4 + 7 + 3
                <ul>
                  <li>A. 12</li>
                  <li>B. 13</li>
                  <li><b>C. 14</b> (respuesta)</li>
                  <li>D. 15</li>
                  <li>E. 16</li>
                </ul>
              </p>
            </v-col>
            <v-col cols="12" sm="6">
              <p class="pt-4">
                <b>Ejemplo 2.</b> 24 / 6 + 3
                <ul>
                  <li><b>A. 7</b> (respuesta)</li>
                  <li>B. 8</li>
                  <li>C. 6</li>
                  <li>D. 10</li>
                  <li>E. 9</li>
                </ul>
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <p class="pt-4">
                <b>Ejemplo 3.</b> 11 + 7 / 3
                <ul>
                  <li>A. 2</li>
                  <li>B. 3</li>
                  <li>C. 4</li>
                  <li>D. 5</li>
                  <li><b>E. 6</b> (respuesta)</li>
                </ul>
              </p>
            </v-col>
            <v-col cols="12" sm="6">
              <p class="pt-4">
                <b>Ejemplo 4.</b> 3 + 4 * 2
                <ul>
                  <li><b>A. 14</b> (respuesta)</li>
                  <li>B. 15</li>
                  <li>C. 16</li>
                  <li>D. 17</li>
                  <li>E. 18</li>
                </ul>
              </p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="edialog = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="cdialog" width="300">
      <v-card>
        <v-card-title class="headline grey lighten-3" primary-title>
          <span class="headline">Alerta</span>
        </v-card-title>
        <v-card-text>
          <p>¿Esta seguro(a) de enviar la prueba?</p>
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
    respuestas: [],
    estudiante: {
      id: "",
      codigo_rude: "",
      nombre: "",
      paterno: "",
      materno: "",
      preguntas: [],
      acierto: 0,
      porcentaje: 0,
      categoria_id: "",
    },
    cateory_id: 1,
    snack: {
      state: false,
      color: "success",
      text: "",
    },
  }),
  mounted() {
    this.server = Service.getServe();
  },
  computed: {
    acierto() {
      return this.estudiante.preguntas.reduce(
        (sum, item) =>
          sum +
          (item.respuesta != null
            ? item.preuniversitario_opcions[item.respuesta]
                .respuesta_correcta === true
              ? 1
              : 0
            : 0),
        0
      );
    },
  },
  methods: {
    searchStudent() {
      if (this.$refs.sform.validate()) {
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
              this.checkResponse(this.estudiante.codigo_rude, this.cateory_id);
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

    getQuestions(cateory_id) {
      this.question_loading = true;
      axios
        .get(Service.getBasePre() + "lista/preguntas/" + cateory_id)
        .then((response) => {
          this.question_loading = false;
          this.estudiante.preguntas = response.data;
          // console.log(response.data);
        })
        .catch((error) => {
          this.question_loading = false;
          console.error("Error al cargar datos", error);
        });
    },

    checkResponse(codigo_rude, cateory_id) {
      this.data_loading = true;
      axios
        .post(
          Service.getBasePre() + "check/respuesta",
          {
            codigo_rude: this.estudiante.codigo_rude,
            categoria_id: cateory_id,
          },
          Service.getHeader()
        )
        .then((response) => {
          this.data_loading = false;
          if (response.data.message == "not") {
            this.estado = "preguntas";
            this.estudiante.preguntas = response.data.result;
          } else {
            this.estado = "tabla";
            this.respuestas = response.data.result;
          }
        })
        .catch((error) => {
          this.data_loading = false;
          console.error("Error al cargar registros", error);
        });
    },

    async showConfirm() {
      let responseExist = await this.estudiante.preguntas.find(
        (item) => item.respuesta != null
      );
      if (responseExist) {
        this.estudiante.acierto = this.acierto;
        if (this.acierto > 0) {
          let cantidadPreguntas = this.estudiante.preguntas.length;
          this.estudiante.porcentaje = Math.round(
            (this.acierto / cantidadPreguntas) * 100
          );
        }
        this.cdialog = true;
      } else {
        this.toast("warning", "Debe marcar las respuestas.");
      }
    },

    sendResult() {
      this.send_loading = true;
      this.estudiante.categoria_id = this.cateory_id;
      axios
        .post(
          Service.getBasePre() + "respuesta",
          this.estudiante,
          Service.getHeader()
        )
        .then((response) => {
          this.send_loading = false;
          if (response.status === 201) {
            this.cdialog = false;
            this.toast("success", response.data.message);
            this.estado = "";
            this.estudiante.preguntas = [];
            this.checkResponse(this.estudiante.codigo_rude, this.cateory_id);
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
<style lang="css">
/* .v-data-table .v-data-table-header {
  background-color: #f5f5f5;
} */
</style>