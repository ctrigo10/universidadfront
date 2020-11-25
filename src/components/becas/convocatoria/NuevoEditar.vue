<template>
  <div>
    <v-tooltip v-model="showDatos" top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        class="mt-5"
          fab
          right
          absolute
          dark
          small
          color="secondary"
          @click="activar()"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon color>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Nueva Convocatoria</span>
    </v-tooltip>

    <v-dialog v-model="dialog" max-width="650px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-form ref="form" lazy-validation>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
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
                        v-model="fecha_registro_convocatoria"
                        label="Fecha de Registro de Becas"
                        readonly
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                        color="secondary"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :min="min_menu1"
                      color="secondary"
                      v-model="dates_registro_convocatoria"
                      range
                      no-title
                    >
                      <v-spacer></v-spacer>
                      <v-btn icon color="primary" @click="menu1 = false">
                        <v-icon>mdi-close-thick</v-icon>
                      </v-btn>
                      <v-btn icon color="secondary" @click="menu1Check">
                        <v-icon>mdi-check-bold</v-icon>
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="6">
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
                        v-model="fecha_solicitud_convocatoria"
                        label="Fecha de Solicitud de Becas"
                        readonly
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                        color="secondary"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :min="min_menu2"
                      color="secondary"
                      v-model="dates_solicitud_convocatoria"
                      range
                      no-title
                    >
                      <v-spacer></v-spacer>
                      <v-btn icon color="primary" @click="menu2 = false">
                        <v-icon>mdi-close-thick</v-icon>
                      </v-btn>
                      <v-btn icon color="secondary" @click="menu2Check">
                        <v-icon>mdi-check-bold</v-icon>
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
               <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="edited_item.ultimos_cursos"
                      label="Notas del/los último(s)"
                      prepend-icon="mdi-animation-outline"
                      onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
                      maxlength="1"
                      suffix="curso(s)"
                      color="secondary"
                      :rules="[rules.required, rules.max9]">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-if="edited_item.ultimos_cursos != 0"
                      v-model="edited_item.ponderacion"
                      label="Ponderación (Max. 100)"
                      prepend-icon="mdi-alarm-panel-outline"
                      onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
                      maxlength="3"
                      suffix="Puntos"
                      :rules="[rules.required, rules.max100]"
                      color="secondary">
                    </v-text-field>
                  </v-col>
               </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark @click="close">Cancelar</v-btn>
            <v-btn
              color="secondary"
              :loading="loading"
              :disabled="loading"
              class="white--text"
              @click="save"
            >{{ registar_editar }}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Beca-Convocatoria-Nuevo-Edit",
  props: {
    dialogF: {
      default: false,
    },
    edited_index_enviar: {
      default: -1,
    },
    edited_item_enviar: {},
  },
  //props:['dialogF', 'edited_index_enviar','edited_item_enviar'],
  created() {
    this.Convocatorias = this.getConvocatorias;
  },
  mounted() {},

  data(){
    return{
      loader: null,
      loading: false,
      registar_editar: "",
      showDatos: false,
      dialog: false,
      edited_index: -1,
      menu1: false,
      menu2: false,
      min_menu2: "",
      min_menu1: "",
      dates_registro_convocatoria: [],
      dates_solicitud_convocatoria: [],
      fecha_registro_convocatoria: "",
      fecha_solicitud_convocatoria: "",
      edited_item: {
        fecha_inicio_registro_beca: "",
        fecha_fin_registro_beca: "",
        fecha_inicio_solicitud_beca: "",
        fecha_fin_solicitud_beca: "",
        fecha_registro_convocatoria: "",
        fecha_solicitud_convocatoria: "",
        seleccionar_becados: false,
        seleccionar_becados_text: "",
        ultimos_cursos: "",
        ponderacion: 0,
      },
      rules: {
        required: (value) => !!value || "Requerido",
        max9: (value) => {
          if (!isNaN(parseFloat(value)) && value >= 0 && value <= 9)
              return true;
            return `Número entre 0 y 9`;
          },
        max100: (value) => {
          let opcion = 0;
          if(this.edited_item.ultimos_cursos > 0)opcion = 1;
          if (!isNaN(parseFloat(value)) && value >= opcion && value <= 100)
            return true;
          return `Número entre ${opcion} y 100`;
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      "getConvocatoriaLast",
      "getConvocatorias",
      "getConvocatoriaActualByVersion",
    ]),

    formTitle() {
      return this.edited_index === -1 ? "Nuevo Registro" : "Editar Registro";
    },
  },

  watch: {
    dialogF() {
      this.registar_editar = "Editar";
      this.dialog = true;
      this.edited_index = this.edited_index_enviar;
      this.edited_item = Object.assign({}, this.edited_item_enviar);
      let anterior = this.getConvocatoriaActualByVersion(
        this.edited_item.version
      );
      if (anterior == 0)
        this.min_menu1 = this.aumentar_dia(anterior.fecha_fin_solicitud_beca);
      this.dates_registro_convocatoria = [
        this.edited_item.fecha_inicio_registro_beca,
        this.edited_item.fecha_fin_registro_beca,
      ];
      this.dates_solicitud_convocatoria = [
        this.edited_item.fecha_inicio_solicitud_beca,
        this.edited_item.fecha_fin_solicitud_beca,
      ];
      this.fecha_registro_convocatoria = this.edited_item.fecha_registro_convocatoria;
      this.fecha_solicitud_convocatoria = this.edited_item.fecha_solicitud_convocatoria;
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 2000);

      this.loader = null;
    },
    'edited_item.ultimos_cursos'(){
      if(this.edited_item.ultimos_cursos == 0){
        this.edited_item.ponderacion = 0;
      }
    },
  },

  methods: {
    ...mapActions(["alert", "editarConvocatoria"]),
    activar() {
      this.registar_editar = "Registrar";
      this.dialog = true;
      this.edited_index = -1;
      if (this.$refs.form) this.$refs.form.resetValidation();
      if (this.$refs.form) this.$refs.form.reset();
      this.dates_registro_convocatoria = [];
      this.dates_solicitud_convocatoria = [];
      let convocatoriaLast = this.getConvocatoriaLast;
      this.min_menu1 = "";
      if (convocatoriaLast.fecha_fin_solicitud_beca) {
        this.min_menu1 = this.aumentar_dia(
          convocatoriaLast.fecha_fin_solicitud_beca
        );
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.edited_item = Object.assign({}, this.defaultItem);
        this.edited_index = -1;
      });
    },

    async save() {
      try {
        if (this.$refs.form.validate() == true) {
          this.loader = "loading";
          if (this.edited_index > -1) {
            //Object.assign(this.Convocatorias[this.edited_index], this.edited_item);
            await this.editarConvocatoria({
              item: this.edited_item,
              index: this.edited_index,
            });
            this.alert({
              text: "Registro editado",
              color: "primary",
            });
          } else {
            this.edited_item.seleccionar_becados = false;
            this.edited_item.seleccionar_becados_text = "No";
            if (this.Convocatorias.length <= 0) this.edited_item.version = 1;
            else {
              this.edited_item.version = (this.Convocatorias[this.Convocatorias.length - 1].version) + 1;
            }
            await this.$store.dispatch("agregarConvocatoria", this.edited_item);
            this.alert({
              text: "Registro guardado",
              color: "primary",
            });
          }
          this.close();
        }
      } catch (error) {
        this.alert({
          text: error.response.data,
          color: "red",
        });
      }
    },

    menu1Check() {
      this.menu1 = false;
      if (this.dates_registro_convocatoria.length == 1) {
        this.dates_registro_convocatoria = [
          this.dates_registro_convocatoria[0],
          this.dates_registro_convocatoria[0],
        ];
      }
      let startDate = new Date(this.dates_registro_convocatoria[0]);
      let end_date = new Date(this.dates_registro_convocatoria[1]);
      this.min_menu2 = this.aumentar_dia(end_date);
      if (startDate > end_date) {
        let temporal = this.dates_registro_convocatoria[1];
        this.dates_registro_convocatoria[1] = this.dates_registro_convocatoria[0];
        this.dates_registro_convocatoria[0] = temporal;
        this.min_menu2 = this.aumentar_dia(startDate);
      }
      let termporal_dates_registro_convocatoria = [];
      this.edited_item.fecha_inicio_registro_beca = this.dates_registro_convocatoria[0];
      this.edited_item.fecha_fin_registro_beca = this.dates_registro_convocatoria[1];
      let [year, month, day] = this.dates_registro_convocatoria[0].split("-");
      termporal_dates_registro_convocatoria[0] = `${day}/${month}/${year}`;
      [year, month, day] = this.dates_registro_convocatoria[1].split("-");
      termporal_dates_registro_convocatoria[1] = `${day}/${month}/${year}`;
      this.fecha_registro_convocatoria = termporal_dates_registro_convocatoria.join(
        " al "
      );
      this.edited_item.fecha_registro_convocatoria = this.fecha_registro_convocatoria;
      //limpiar menu2
      this.dates_solicitud_convocatoria = [];
      this.edited_item.fecha_inicio_solicitud_beca = "";
      this.edited_item.fecha_fin_solicitud_beca = "";
      this.fecha_solicitud_convocatoria = "";
    },

    menu2Check() {
      this.menu2 = false;
      if (this.dates_solicitud_convocatoria.length == 1) {
        this.dates_solicitud_convocatoria = [
          this.dates_solicitud_convocatoria[0],
          this.dates_solicitud_convocatoria[0],
        ];
      }
      let startDate = new Date(this.dates_solicitud_convocatoria[0]);
      let end_date = new Date(this.dates_solicitud_convocatoria[1]);
      if (startDate > end_date) {
        let temporal = this.dates_solicitud_convocatoria[1];
        this.dates_solicitud_convocatoria[1] = this.dates_solicitud_convocatoria[0];
        this.dates_solicitud_convocatoria[0] = temporal;
      }
      let termporal_dates_solicitu_convocatoria = [];
      this.edited_item.fecha_inicio_solicitud_beca = this.dates_solicitud_convocatoria[0];
      this.edited_item.fecha_fin_solicitud_beca = this.dates_solicitud_convocatoria[1];
      let [year, month, day] = this.dates_solicitud_convocatoria[0].split("-");
      termporal_dates_solicitu_convocatoria[0] = `${day}/${month}/${year}`;
      [year, month, day] = this.dates_solicitud_convocatoria[1].split("-");
      termporal_dates_solicitu_convocatoria[1] = `${day}/${month}/${year}`;
      this.fecha_solicitud_convocatoria = termporal_dates_solicitu_convocatoria.join(
        " al "
      );
      this.edited_item.fecha_solicitud_convocatoria = this.fecha_solicitud_convocatoria;
    },

    aumentar_dia(date) {
      let fecha_date = new Date(date);
      let Fecha_date_mas = fecha_date.setDate(fecha_date.getDate() + 2);
      let d = new Date(Fecha_date_mas);
      return d.toLocaleDateString("fr-CA");
    },
  },
};
</script>
