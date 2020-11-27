<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Aptitud Mecánica"></header-title>
      <v-row class="mb-6">
        <v-col cols="12" sm="12">
          <v-card>
            <v-card-text>
              Ingrese código RUDE.
              <v-form ref="sform" v-on:submit.prevent="searchStudent">
                <v-row>
                  <v-col cols="12" sm="8" class="py-0">
                    <v-text-field
                      label="Código RUDE"
                      v-model="estudiante.codigo_rude"
                      :rules="[(v) => !!v || 'Campo requerido']"
                      autocomplete="off"
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
                <v-col cols="12" sm="8" md="8">
                  <v-text-field
                    v-model="estudiante.apellido"
                    label="Apellidos"
                    filled
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <div v-if="estado == 'preguntas'">
                <p>
                  Esta prueba contiene una serie de figuras, acerca de las cuales se hacen algunas preguntas. Para aprender cómo debes responderlas, vease los ejemplos que se consignan a continuación:
                  <v-btn small dark color="grey" @click="edialog = true"
                    >Ejemplos</v-btn
                  >
                </p>
                <h3 class="teal--text my-2">Preguntas (34 minutos)</h3>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    v-for="(pregunta, idx) in estudiante.preguntas"
                    :key="idx"
                  >
                    <div>
                      <span>{{ pregunta.descripcion }}<br /></span>
                      <img
                        v-if="pregunta.imagen != ''"
                        :src="`${server}images/preguntas/${pregunta.imagen}`"
                      />
                      <v-radio-group v-model="pregunta.respuesta" row>
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
                        <th class="text-left">Nombre completo</th>
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
          <p class="pt-4">
            <b>Ejemplo 1.</b> ¿Qué hombre soporta mayor peso? (Si los dos igual, rodee la letra C).
            En esta figura se muestra a dos hombres (A y B) que transportan una pieza sobre una tabla y se pregunta: “¿Qué hombre soporta mayor peso?”.
            Hay tres posibilidades de respuesta:
            <ul>
              <li>Si el hombre A sostiene mayor peso, marca la letra A.</li>
              <li>Si fuera el hombre B quién soporta mayor peso, marca la letra B.</li>
              <li>Si los dos soportan igual peso, marca la letra C.</li>
            </ul>
          </p>
          <img :src="`${server}images/preguntas/imagen3e1.png`" width="100%" />
          <span>La respuesta correcta es la que indica la letra <b>B</b></span>
          <p class="pt-4">
            <b>Ejemplo 2.</b> ¿Qué pesa más? (Si las dos cosas igual, marca la letra C).
            Fíjate ahora en el ejemplo Y. La pregunta es: “¿Qué pesa más?”. Como la balanza está perfectamente equilibrada, A y B deben tener el mismo peso.
          </p>
          <img :src="`${server}images/preguntas/imagen3e2.png`" width="100%" />
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
      apellido: "",
      preguntas: [],
      acierto: 0,
      porcentaje: 0,
      categoria_id: "",
    },
    cateory_id: 3,
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
        this.estudiante.apellido = "";
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
              if (
                response.data.paterno &&
                response.data.paterno != null &&
                response.data.paterno != ""
              ) {
                this.estudiante.apellido = response.data.paterno.trim();
              }
              if (
                response.data.materno &&
                response.data.materno != null &&
                response.data.materno != ""
              ) {
                this.estudiante.apellido = (
                  this.estudiante.apellido +
                  " " +
                  response.data.materno
                ).trim();
              }
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