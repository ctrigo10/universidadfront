<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Inscripción"></header-title>
      <v-row class="mb-6">
        <v-col cols="12" sm="12">
          <v-card class="mb-5 flat">
            <v-card-text v-if="curso_habilitado.length > 0">
              <v-select
                label="Seleccione curso"
                v-model="estudiante.curso_id"
                :items="curso_habilitado"
                item-text="descripcion"
                item-value="id"
                @change="showForm"
              ></v-select>
              <p v-if="habilitado" class="mt-2">
                La inscripción está habilitado desde:
                <b>{{ fecha_inicio | formatdate }}</b>
                a
                <b>{{ fecha_fin | formatdate }}</b>
              </p>
            </v-card-text>
            <v-card-text v-else>
              <b class="teal--text">{{ msg_check.title }}</b>
              <p class="red--text mt-2">
                {{ msg_check.message }}
              </p>
            </v-card-text>
          </v-card>
          <v-card>
            <!-- <v-card-title> Ingrese código RUDE. </v-card-title> -->
            <v-card-text v-if="habilitado">
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
              <v-form ref="iform">
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="estudiante.nombres"
                      label="Nombres"
                      filled
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="estudiante.apellidos"
                      label="Apellidos"
                      filled
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row v-if="estado == 'inscribirse'">
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      label="Departamento"
                      v-model="estudiante.departamento"
                      :items="departamentos"
                      item-text="descripcion"
                      item-value="id"
                      filled
                      :rules="[(v) => !!v || 'Seleccione una opción']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="estudiante.correo"
                      label="Correo electrónico"
                      filled
                      :rules="[
                        (v) => !!v || 'El campo es requerido',
                        (v) => /.+@.+/.test(v) || 'Correo no valido',
                      ]"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn large color="primary" @click="showConfirm">
                      <v-icon small>mdi-send</v-icon>
                      Inscribirse
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-else-if="estado == 'inscrito'">
                  <v-col cols="12" class="text-center">
                    <h3 class="teal--text">
                      El/La estudiante ya está inscrito
                    </h3>
                  </v-col>
                </v-row>
              </v-form>
              <div v-if="data_loading" class="text-center">
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
  name: "inscripcion",
  components: {
    HeaderTitle,
  },
  data: () => ({
    cdialog: false,
    data_loading: false,
    send_loading: false,
    btn_loading: false,
    estudiante: {
      curso_id: "",
      codigo_rude: "",
      nombres: "",
      apellidos: "",
      departamento: "",
      ci: "",
      complemento: "",
      correo: "",
    },
    fecha_inicio: "",
    fecha_fin: "",
    estado: "",
    habilitado: false,
    curso_habilitado: {},
    departamentos: [],
    msg_check: {
      title: "",
      message: "",
    },
    snack: {
      state: false,
      color: "success",
      text: "",
    },
  }),
  mounted() {
    this.checkCursoHabilitado();
    this.departamentos = [
      { id: "Chuquisaca", descripcion: "Chuquisaca" },
      { id: "La Paz", descripcion: "La Paz" },
      { id: "Cochabamba", descripcion: "Cochabamba" },
      { id: "Oruro", descripcion: "Oruro" },
      { id: "Potosí", descripcion: "Potosí" },
      { id: "Tarija", descripcion: "Tarija" },
      { id: "Santa Cruz", descripcion: "Santa Cruz" },
      { id: "Beni", descripcion: "Beni" },
      { id: "Pando", descripcion: "Pando" },
    ];
  },
  methods: {
    checkCursoHabilitado() {
      axios
        .get(Service.getBasePre() + "habilitar/cursos/inscripcion")
        .then((response) => {
          this.curso_habilitado = response.data;
          this.msg_check.title = "Nota:";
          this.msg_check.message =
            "No existe ningún Curso Pre Universitario habilitado para la inscripción.";
        })
        .catch((error) => {
          console.error("Error al cargar registros", error);
        });
    },
    showForm() {
      let data = this.curso_habilitado.find(
        (item) => item.id === this.estudiante.curso_id
      );
      if (data) {
        this.fecha_inicio = data.fecha_inicio;
        this.fecha_fin = data.fecha_fin;
        this.habilitado = true;
      }
    },
    searchStudent() {
      if (this.$refs.sform.validate()) {
        this.btn_loading = true;
        this.estado = "";
        this.estudiante.apellidos = "";
        axios
          .post(
            Service.getBasePre() + "busca/estudiante",
            { codigo_rude: this.estudiante.codigo_rude },
            Service.getHeader()
          )
          .then((response) => {
            this.btn_loading = false;
            if (response.data.id > 0) {
              this.estudiante.nombres = response.data.nombre;
              if (
                response.data.paterno &&
                response.data.paterno != null &&
                response.data.paterno != ""
              ) {
                this.estudiante.apellidos = response.data.paterno.trim();
              }
              if (
                response.data.materno &&
                response.data.materno != null &&
                response.data.materno != ""
              ) {
                this.estudiante.apellidos = (
                  this.estudiante.apellidos +
                  " " +
                  response.data.materno
                ).trim();
              }
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
            this.estado = "inscrito";
          }
        })
        .catch((error) => {
          this.data_loading = false;
          console.error("Error al cargar registros", error);
        });
    },

    showConfirm() {
      if (this.$refs.iform.validate()) {
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
            this.estudiante.correo = "";
            this.estudiante.departamento = "";
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