<template>
  <div v-if="!loadingEspera">
    <v-card-title>{{ estudiante.nombre_completo }}</v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation enctype="multipart/form-data">
        <v-row class="">
          <v-col cols="12" sm="6">
            <v-text-field
              prepend-icon="mdi-cellphone-android"
              v-model="celular"
              :rules="[rules.required, rules.cel]"
              label="Número celular"
              required
              color="secondary"
              @keyup.enter="solicitarConfirmar"
              onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
              maxlength="8"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              prepend-icon="mdi-email"
              v-model="correo"
              :rules="[rules.required, rules.email]"
              label="Correo electrónico"
              maxlength="20"
              color="secondary"
              @keyup.enter="solicitarConfirmar"
            ></v-text-field>
          </v-col>
          <v-col
            v-for="(pregunta, index) in getPreguntas"
            :key="pregunta.id"
            class="d-flex child-flex"
            cols="12"
            sm="12"
            md="6"
          >
            <v-card class="mt-n3">
              <v-row class="mt-n3">
                <v-col cols="12">
                  <v-card-subtitle
                    >{{ pregunta.pregunta }}
                    <small v-if="pregunta.comentario != ''"
                      >({{ pregunta.comentario }})</small
                    ></v-card-subtitle
                  >
                </v-col>
              </v-row>
              <v-row class="mt-n9 mb-n5">
                <v-col cols="12" sm="7" md="7">
                  <v-card-text v-if="pregunta.seleccion_multiple">
                    <!-- selección múltiple -->
                    <v-select
                      :items="pregunta.brespuesta"
                      :item-text="text"
                      item-value="id"
                      required
                      :rules="rules.select2"
                      :menu-props="{ bottom: true, offsetY: true }"
                      attach
                      chips
                      label="Puede elegir más de una opción"
                      multiple
                      color="secondary"
                      v-model="respuestas[index]"
                      @change="verArchivoM($event, index)"
                    ></v-select>
                  </v-card-text>
                  <v-card-text v-else>
                    <!-- selección simple -->
                    <div v-if="pregunta.brespuesta.length == 2">
                      <!-- dos respuestas -->
                      <v-radio-group
                        row
                        v-model="respuestas[index]"
                        required
                        :rules="[rules.required]"
                      >
                        <v-radio
                          v-for="respuesta in pregunta.brespuesta"
                          :key="respuesta.id"
                          :label="respuesta.respuesta"
                          :value="respuesta.id"
                          color="secondary"
                          @click="verArchivo(respuesta, index)"
                        >
                        </v-radio>
                      </v-radio-group>
                    </div>
                    <div v-else>
                      <!-- diferente de dos respuestas -->
                      <v-select
                        :items="pregunta.brespuesta"
                        :item-text="text"
                        item-value="id"
                        color="secondary"
                        :rules="[rules.required]"
                        required
                        label="Elija una opción"
                        v-model="respuestas[index]"
                        @change="verArchivo($event, index)"
                      ></v-select>
                    </div>
                  </v-card-text>
                </v-col>
                <v-col
                  cols="12"
                  md="5"
                  sm="5"
                  v-if="mostrarArchivo[index]"
                  :class="archivo_pantalla"
                >
                  <v-file-input
                    :rules="[rules.archivo, rules.required]"
                    placeholder="Adjuntar"
                    accept="image/*,.pdf"
                    prepend-icon="mdi-clippy"
                    label="Adjuntar archivo"
                    color="secondary"
                    @change="onFileChange($event, index)"
                  >
                  </v-file-input>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Condiciones -->
        <v-checkbox
          v-for="condicion in getCondiciones"
          :key="condicion.id"
          v-model="checkbox"
          value="true"
          required
          :rules="[rules.required]"
          color="secondary"
          class="mb-n5"
        >
          <template v-slot:label>
            <div class="text-justify">
              {{ condicion.mensaje }}.
              <v-tooltip bottom v-if="condicion.archivo != ''">
                <template v-slot:activator="{ on }">
                  <a
                    target="_blank"
                    :href="host + condicion.pathFile"
                    @click.stop
                    v-on="on"
                  >
                    Ver documento
                  </a>
                </template>
                Ver documento
              </v-tooltip>
            </div>
          </template>
        </v-checkbox>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="12" md="9">
          <v-btn
            color="secondary"
            block
            class="white--text"
            @click="solicitarConfirmar"
            :loading="loading"
            :disabled="loading"
            >Solicitar beca</v-btn
          >
        </v-col>
        <v-col cols="12" md="3">
          <v-btn color="primary" block dark @click="cancelar"
            >Limpiar datos</v-btn
          >
        </v-col>
      </v-row>
    </v-card-actions>
    <SolicitudPdf :descargar="descargar" :solicitud_id="solicitud_id" />
  </div>
  <Loading v-else />
</template>
<script>
import becasService from "@/services/becasService";
import Loading from "@/components/becas/shared/Loading";
import { mapGetters, mapActions } from "vuex";
import SolicitudPdf from "@/components/becas/shared/SolicitudPdf";
export default {
  name: "beca-formulario-solicitud",
  props: ["estudiante"],
  components: { Loading, SolicitudPdf },
  async mounted() {
    try {
      this.loadingEspera = true;
      this.host = becasService.getBaseBeca();
      await this.cargarPreguntas(0);
      await this.cargarCondiciones(0);
    } catch (error) {
      this.alert({
        text: "Existe un error",
        color: "red",
      });
    } finally {
      this.loadingEspera = false;
    }
  },
  data() {
    return {
      descargar: false,
      solicitud_id: 0,
      solicitud_idd: 0,
      host: "",
      correo: "",
      celular: "",
      loader: null,
      dialog: false,
      loading: false,
      loadingEspera: true,
      respuestas: [],
      bass: [],
      archivos: [],
      archivoPrueba: "",
      mostrarArchivo: [],
      checkbox: false,
      rules: {
        select2: [(v) => v.length > 0 || "Requerido"],
        required: (value) => !!value || "Requerido",
        archivo: (value) =>
          !value || value.size < 2000000 || "Tamaño debe ser menor de 2 MB!",
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalido correo.";
        },
        cel: (value) => {
          if (
            !isNaN(parseFloat(value)) &&
            value >= 10000000 &&
            value <= 99999999
          )
            return true;
          return "Debe tener 8 dígitos numéricos";
        },
      },
    };
  },
  computed: {
    ...mapGetters([
      "getPreguntas",
      "getCondiciones",
      "getRespuesta",
      "getCarreraSolicitudes",
      "getDisplayGrande"
    ]),
    archivo_pantalla(){
      return (this.getDisplayGrande) ? 'mt-4 ml-n5' : 'mt-n9 ml-3 mr-n9 pr-9';
    }
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 4000);
      this.loader = null;
    },
  },
  methods: {
    ...mapActions(["alert", "cargarPreguntas", "cargarCondiciones"]),
    text: (item) => item.respuesta,
    onFileChange(event, index) {
      this.archivos[index] = event;
      this.archivoPrueba = event;
    },
    verArchivo(item, index) {
      if (!item.id) item = this.getRespuesta(index, item);
      item.archivo == true
        ? (this.mostrarArchivo[index] = true)
        : (this.mostrarArchivo[index] = false);
      this.archivos[index] = null;
    },
    verArchivoM(item, index) {
      let cantArcihvos = 0;
      for (let i = 0; i < item.length; i++) {
        if (this.getRespuesta(index, item[i]).archivo == true) cantArcihvos++;
      }
      if (cantArcihvos > 0) {
        this.mostrarArchivo[index] = true;
      } else {
        this.mostrarArchivo[index] = false;
        this.archivos[index] = null;
      }
    },
    cancelar() {
      if (this.$refs.form) this.$refs.form.resetValidation();
      if (this.$refs.form) this.$refs.form.reset();
    },
    solicitarConfirmar() {
      if (this.$refs.form.validate() == true) {
        this.$vuetifyConfirmDialog
          .open(
            "Confirmación",
            `Está por enviar su solicitud de beca, confimar si todos los datos fueron correctamente llenados. Datos para contactarnos celular: ${this.celular} y correo: ${this.correo}. Gracias.`,
            "Cancelar",
            "Confirmar",
            "primary",
            "secondary"
          )
          .then((state) => {
            if (state == true) this.solicitarBeca();
          });
      }
    },
    async solicitarBeca() {
      try {
        this.loader = "loading";
        let data = new FormData();
        data.append("celular", this.celular);
        data.append("correo", this.correo);
        data.append(
          "universidad_beca_carrera_id",
          this.getCarreraSolicitudes.universidad_beca_carrera_id
        );
        data.append("estudiante_id", this.estudiante.id);
        for (let resp of this.respuestas) {
          if (resp.length > 0)
            for (let resp2 of resp) data.append("respuestas", resp2);
          else data.append("respuestas", resp);
        }
        for (var i = 0; i < this.archivos.length; i++) {
          let file = this.archivos[i];
          if (file == null) data.append("archivo", "");
          else data.append("archivo", file);
        }
        //en que id guardar los nombres de archivos
        let j = -1;
        for (let index = 0; index < this.respuestas.length; index++) {
          if (this.respuestas[index].length > 0)
            if (this.archivos[index] != null) {
              j++;
              for (let resp in this.respuestas[index]) {
                this.bass.push(resp);
                data.append("ordenIm", j);
              }
            } else {
              for (let resp in this.respuestas[index]) {
                this.bass.push(resp);
                data.append("ordenIm", -1);
              }
            }
          else {
            if (this.archivos[index] != null) {
              j++;
              data.append("ordenIm", j);
            } else data.append("ordenIm", -1);
          }
        }
        let Solicitud = await becasService.addSolicitud(data);
        Solicitud = Solicitud.data.data;
        this.solicitud_idd = Solicitud.id;
        //<PDF>
        this.solicitud_id = Buffer.from(`Solicitud ${Solicitud.id}`).toString(
          "hex"
        );
        this.descargar = !this.descargar;
        //</PDF>
        this.alert({
          text:
            "Solicitud de beca realizada, puede hacer el seguimiento correspondiente desde el sistema en SEGUIMIENTO BECA, ESPERE SU PDF.",
          color: "primary",
        });
      } catch (error) {
        let texto = error;
        if (error.response) texto = error.response.data.msg;
        this.alert({
          text: texto,
          color: "red",
        });
      } finally {
        setTimeout(
          () =>
            this.$router.push({
              name: "becas-seguimiento",
              params: { solicitud_id: this.solicitud_idd },
            }),
          3000
        );
      }
    },
  },
};
</script>