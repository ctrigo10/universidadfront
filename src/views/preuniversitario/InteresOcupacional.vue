<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Interes Ocupacional"></header-title>
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
                <p>El siguiente cuestionario tiene por objeto ayudarte a elegir la clase de estudios y ocupaciones que son más apropiados para ti.</p>
                <p>Este cuestionario no es una prueba, sino una serie de preguntas sobre tus gustos o intereses. Si contestas a cada una de ellas, en forma franca y sincera, de manera cuidadosa, los resultados serán útiles para ti y ayudarte a planear tus estudios y tu carrera.</p>
                <p>Fíjate en el siguiente ejemplo, para mostrarte la forma cómo debes contestar a cada una de las preguntas del cuestionario.</p>
                <p>
                  <b>¿Cuánto te gustaría comer cuando tienes hambre?</b><br>
                  La persona que escribió el 5, expresó que “le gusta mucho” comer cuando tiene hambre. En general, los números que escribirás son del 1 al 5 y significarán:
                  <ul>
                    <li>5 significa “me gusta mucho”</li>
                    <li>4 significa “me gusta un poco”</li>
                    <li>3 significa “me es indiferente, puesto que ni me gusta ni me disgusta”</li>
                    <li>2 significa “me disgusta un poco”</li>
                    <li>1 significa “me disgusta mucho”</li>
                  </ul>
                </p>
                <h3 class="teal--text my-2">Cuestionario (30 minutos)</h3>
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
                        <div v-for="(oitem, jdx) in pregunta.preuniversitario_opcions" :key="jdx">
                            <v-layout row wrap>
                              <v-flex xs4 sm2>
                                <v-select
                                  class="py-0"
                                  solo hide-details height="15"
                                  v-model="oitem.valor"
                                  :items="[1, 2, 3, 4, 5]"
                                  :rules="[(v) => !!v || '']"
                                  required
                                ></v-select>
                              </v-flex>
                              <v-flex xs8 xs10>
                                <span>{{ oitem.opcion }}</span>
                              </v-flex>
                            </v-layout>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn large color="primary" @click="showConfirm">
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
                        <th class="text-left">Carreras</th>
                        <th class="text-center">Aciertos (#)</th>
                        <th class="text-center">Porcentaje (%)</th>
                        <th class="text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in respuestas" :key="index"
                      >
                        <td>{{ item.respuesta }}</td>
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
    question_loading: false,
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
      acierto: 0,
      porcentaje: 0,
      categoria_id: "",
    },
    cateory_id: 6,
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
          Service.getBasePre() + "check/respuestaio",
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
        for (const key in this.estudiante.preguntas) {
          let sum_all = await this.estudiante.preguntas[
            key
          ].preuniversitario_opcions.reduce((sum, item) => sum + item.valor, 0);
          this.estudiante.preguntas[key].respuesta = sum_all;
          let percent = 0;
          if (sum_all > 0) {
            percent = Math.round((sum_all / 25) * 100);
          }
          this.estudiante.preguntas[key].porcentaje = percent;
        }
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
          Service.getBasePre() + "respuesta/interes/ocupacional",
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