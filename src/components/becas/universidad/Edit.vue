<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="330">
      <v-card>
        <v-card-title>
          <span class="headline">Estudiantes</span>
        </v-card-title>
        <v-form ref="form" lazy-validation>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="edited_item.cantidad_estudiantes"
                    label="Cantidad"
                    required
                    @keyup.enter="save"
                    color="secondary"
                    :rules="[rules.required, rules.numberRule]"
                    maxlength="7"
                    onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    readonly
                    prepend-icon="mdi-handshake"
                    type="text"
                    v-model="becas"
                    @keyup.enter="save"
                    label="Becas"
                    :rules="[rules.required, rules.becas]"
                    required
                    color="secondary"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="close">Cancelar</v-btn>
          <v-btn color="secondary" class="white--text" @click="save" :loading="loading" :disabled="loading">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import { mapActions } from "vuex";
export default {
  props: {
    dialogF: {
      default: false,
    },
    edited_item_enviar: {},
    edited_index_enviar: {
      default: -1,
    },
  },
  data() {
    return {
      dialog: false,
      loader: null,
      loading: false,
      edited_item: [],
      cantidad_estudiantes: 0,
      edited_index: -1,
      rules: {
        required: (value) => !!value || "Requerido",
        numberRule: (value) => {
          if (!isNaN(parseFloat(value)) && value >= 0 && value <= 999999)
            return true;
          return "Debe ser un número";
        },
        becas: (value) => {
          if (!isNaN(parseFloat(value)) && value > 0 && value <= 999999)
            return true;
          return `Debe ser un número`;
        },
      },
    };
  },
  methods: {
    ...mapActions(["editarUniversidad", "alert", "agregarUniversidad"]),
    async save() {
      this.edited_item.cantidad_becas = Math.round(
        this.edited_item.cantidad_estudiantes * 0.05
      );
      try {
        if (this.$refs.form.validate() == true) {
          this.loader = "loading";
          if (this.edited_item.id == 0) {
            //Crear
            await this.agregarUniversidad({
              item: this.edited_item,
              index: this.edited_index,
            });
            this.alert({
              text: "Registro guardado",
              color: "primary",
            });
          } else {
            //Editar
            await this.editarUniversidad({
              item: this.edited_item,
              index: this.edited_index,
            });
            this.alert({
              text: "Registro editado",
              color: "primary",
            });
          }
          this.close();
        }
      } catch (error) {
        let text = error;
        if(error.response.data.errors)text = error.response.data.errors[0].message;
        if(error.response.data.msg)text = error.response.data.msg;
        this.alert({
          text: text,
          color: "red",
        });
      }
    },
    close() {
      this.dialog = false;
    },
  },
  watch: {
    dialogF() {
      this.dialog = true;
      this.edited_index = this.edited_index_enviar;
      if (this.$refs.form) this.$refs.form.resetValidation();
      this.edited_item = Object.assign({}, this.edited_item_enviar);
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 2000);

      this.loader = null;
    },
  },
  computed: {
    becas() {
      return Math.round(this.edited_item.cantidad_estudiantes * 0.05);
    },
  },
};
</script>