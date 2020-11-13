<template>
  <div>
    <v-dialog v-model="dialog" max-width="670">
      <v-card>
        <v-card-title class="headline">{{ nuevoEditar }}</v-card-title>
        <v-form ref="form" lazy-validation>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="7" md="7">
                  <v-text-field
                    label="Respuesta"
                    v-model.trim="edited_item.respuesta"
                    :rules="[rules.required]"
                    @keyup.enter="save"
                    required
                    color="secondary"
                    prepend-icon="mdi-comment-processing-outline"
                    maxlength="50"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="5" md="5">
                  <v-text-field
                    label="Puntaje"
                    v-model="edited_item.puntaje"
                    @keyup.enter="save"
                    required
                    color="secondary"
                    :rules="[rules.required, rules.numberRule]"
                    prepend-icon="mdi-numeric"
                    onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
                    maxlength="3"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="7" md="7">
                  <v-text-field
                    label="Aclaración de Respuesta"
                    v-model.trim="edited_item.comentario"
                    @keyup.enter="save"
                    required
                    color="secondary"
                    prepend-icon="mdi-message-text-outline"
                    maxlength="50"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="5" md="5">
                  <v-switch
                    color="secondary"
                    v-model="edited_item.archivo"
                    class="ma-2"
                    label="Adjuntar archivo"
                    prepend-icon="mdi-clippy"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="close">Cancelar</v-btn>
          <v-btn
            color="secondary"
            class="white--text"
            @click="save"
            :loading="loading"
            :disabled="loading"
          >{{ btnRegistrarEditar }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props:["nuevoEditar","dialogF","itemEnviar"],
  data() {
    return {
      loader: null,
      dialog: false,
      loading: false,
      edited_item:{},
      rules: {
          required: (value) => !!value || "Requerido",
          numberRule: (value) => {
          if (!isNaN(parseFloat(value)) && value >= 0 && value <= 100)
              return true;
          return `Número entre 0 y 100`;
          },
      },
  };
},
  methods: {
    ...mapActions(["alert","agregarRespuesta","editarRespuesta"]),
    close(){
      this.dialog = false;
    },
    async save(){
      try{
        if (this.$refs.form.validate() == true) {
          this.loader = "loading";
          if(this.nuevoEditar == "Nuevo Registro"){
            //Nuevo
            await this.agregarRespuesta(this.edited_item);
            this.alert({
              text: "Registro guardado",
              color: "primary",
            });
          }else{
            //editar
            await this.editarRespuesta(this.edited_item);
            this.alert({
              text: "Registro editado",
              color: "primary",
            });
          }
        }
        this.close();
      }
      catch(error){
        let texto = error;
        if(error.response)texto = error.response.data;
        if(error.response.data.msg)texto = error.response.data.msg;
        this.alert({
          text: texto,
          color: "red",
        });
      }
    },
  },
  watch:{
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 2000);

      this.loader = null;
    },
    dialogF(){
      if (this.$refs.form) this.$refs.form.resetValidation();
      this.edited_item = Object.assign({}, this.itemEnviar);
      if(this.nuevoEditar == "Nuevo Registro"){
        if (this.$refs.form) this.$refs.form.reset();
      }
      this.dialog = true;
    }
  },
  computed:{
    btnRegistrarEditar(){
      return this.nuevoEditar == "Nuevo Registro" ? "Guardar" : "Editar"
    }
  }
};
</script>