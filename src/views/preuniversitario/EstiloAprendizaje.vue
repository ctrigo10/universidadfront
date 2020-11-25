<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Estilos de Aprendizaje"></header-title>
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
                <!-- <v-col cols="12" sm="6" md="4">
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
                </v-col> -->
                <v-col cols="12" sm="8" md="8">
                  <v-text-field
                    v-model="estudiante.paterno"
                    label="Apellidos"
                    filled
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <div v-if="estado == 'preguntas'">
                <p>
                  Los estilos de aprendizaje describe la manera en que usted
                  aprende y maneja las ideas y las situaciones diarias en su
                  vida. Cada oración lleva cuatro terminaciones. Evalúe las
                  terminaciones de cada oración de acuerdo con lo que usted
                  estima sería lo más apropiado en relación con la manera en la
                  que usted actuaría al tener que aprender algo. Trate de
                  recordar algunas situaciones recientes en las que tuvo que
                  aprender algo nuevo.
                </p>
                <p>
                  Evalúe con un “4” la terminación de la oración que describe la
                  mejor manera en la que usted aprende, descendiendo hasta
                  llegar a “1” para la terminación de la oración que estima que
                  es la manera menos probable en que usted aprende algo.
                </p>
                <p>
                  Asegúrense de evaluar las terminaciones de cada oración. Por
                  favor no las combines.
                </p>
                <p>
                  <b
                    >EN UNA MISMA SECCIÓN NO PUEDEN REPETIRSE LOS NÚMEROS DE
                    RESPUESTA</b
                  >
                </p>
                <h3 class="teal--text my-2">Cuestionario (20 minutos)</h3>
                <v-form ref="iform">
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                      v-for="(pregunta, idx) in estudiante.preguntas"
                      :key="idx"
                    >
                      <div>
                        <span>{{ pregunta.descripcion }}<br /></span>
                        <div
                          v-for="(oitem,
                          jdx) in pregunta.preuniversitario_opcions"
                          :key="jdx"
                        >
                          <v-layout row wrap>
                            <v-flex xs4 sm2>
                              <v-select
                                class="py-0"
                                solo
                                hide-details
                                height="15"
                                v-model="oitem.valor"
                                :items="[1, 2, 3, 4]"
                                :rules="[(v) => !!v]"
                                required
                              ></v-select>
                            </v-flex>
                            <v-flex xs8 xs10>
                              <span>{{ oitem.opcion }}</span>
                            </v-flex>
                          </v-layout>
                        </div>
                        <div v-if="pregunta.respuesta != null">
                          <p
                            v-if="pregunta.respuesta == 'ok'"
                            class="green--text"
                          >
                            Orden Correcto
                          </p>
                          <p v-else class="red--text">Orden Incorrecto</p>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        :loading="check_loading"
                        large
                        color="primary"
                        @click="showConfirm"
                      >
                        <v-icon small>mdi-send</v-icon>
                        Enviar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
              <div v-else-if="estado == 'tabla'">
                <h3 class="teal--text my-2">Resultado del Cuestionario</h3>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Tendencias</th>
                        <th class="text-center">Porcentaje (%)</th>
                        <th class="text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in respuestas" :key="index">
                        <td>{{ item.respuesta }}</td>
                        <td class="text-center">{{ item.porcentaje }}</td>
                        <td>
                          <span
                            v-if="
                              item.estado == 1 ||
                              item.estado == true ||
                              item.estado == 'true'
                            "
                          >
                            <v-chip small color="green lighten-4"
                              >activo</v-chip
                            >
                          </span>
                          <span v-else>
                            <v-chip small color="red lighten-4"
                              >inactivo</v-chip
                            >
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
    <v-dialog v-model="cdialog" width="300">
      <v-card>
        <v-card-title class="headline grey lighten-3" primary-title>
          <span class="headline">Alerta</span>
        </v-card-title>
        <v-card-text>
          <p>¿Esta seguro(a) de enviar el custionario?</p>
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
    cdialog: false,
    loading: false,
    check_loading: false,
    data_loading: false,
    send_loading: false,
    btn_loading: false,
    estado: "",
    respuestas: [],
    estudiante: {
      id: "",
      codigo_rude: "",
      nombre: "",
      paterno: "",
      materno: "",
      preguntas: [],
      respuestas: [],
      acierto: 0,
      porcentaje: 0,
      categoria_id: "",
    },
    cateory_id: 7,
    snack: {
      state: false,
      color: "success",
      text: "",
    },
  }),
  mounted() {},
  computed: {},
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

    checkResponse(codigo_rude, cateory_id) {
      this.data_loading = true;
      axios
        .post(
          Service.getBasePre() + "check/respuestaea",
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
      if (this.$refs.iform.validate()) {
        this.check_loading = true;
        this.estudiante.respuestas = [0, 0, 0, 0];
        for (const key in this.estudiante.preguntas) {
          let sum_all = await this.estudiante.preguntas[
            key
          ].preuniversitario_opcions.reduce((sum, item, index) => {
            this.estudiante.respuestas[index] += item.valor;
            return sum + item.valor;
          }, 0);
          if (sum_all == 10) {
            this.estudiante.preguntas[key].respuesta = "ok";
          } else {
            this.estudiante.preguntas[key].respuesta = "not";
          }
        }
        this.check_loading = false;
        this.cdialog = true;
      } else {
        this.toast("warning", "Responda todas las preguntas.");
      }
    },

    sendResult() {
      this.send_loading = true;
      this.estudiante.categoria_id = this.cateory_id;
      axios
        .post(
          Service.getBasePre() + "respuesta/estilo/aprendizaje",
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