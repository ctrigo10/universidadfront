<template>
  <v-card class="mt-2">
    <v-form ref="form" lazy-validation>
      <v-card-subtitle>
        <v-row class="mt-n7 mb-n7">
          <v-col cols="5">
            <v-select
              color="secondary"
              label="Gestión"
              v-model="gestion_tipo_id"
              :rules="[rules.required]"
              :items="gestiones"
            >
            </v-select>
          </v-col>
          <v-col cols="5">
            <v-select
              color="secondary"
              label="Convocatoria"
              v-model="version"
              :rules="[rules.required]"
              :items="versiones"
            >
            </v-select>
          </v-col>
          <v-col cols="2" class="mt-3">
            <v-btn
              color="secondary"
              class="white--text"
              fab
              small
              @click="save"
              :loading="loading"
              :disabled="loading"
              ><v-icon>mdi-magnify</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-card-subtitle>
    </v-form>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
import becasService from "@/services/becasService";
export default {
  props: ["gestion_tipo_id_enviar", "version_enviar"],
  data() {
    return {
      loader: null,
      dialog: false,
      loading: false,
      gestion_tipo_id: 0,
      version: '',
      gestiones: [],
      versiones: [],
      buscar: {},
      rules: {
        required: (value) => !!value || "Requerido"
      },
    };
  },
  async mounted() {
    try {
      this.gestion_tipo_id = this.gestion_tipo_id_enviar;
      this.version = this.version_enviar;
      let gestiones = await becasService.getGestiones();
      for (let gestion of gestiones.data.data)
        this.gestiones.push(gestion.gestion_tipo_id);
      // let versiones = await becasService.getVersiones(this.gestion_tipo_id);
      // for(let version of versiones.data.data)this.versiones.push(version.version);
    } catch (error) {
      let texto = error;
      if (error.response) texto = error.response.data;
      this.alert({
        text: texto,
        color: "red",
      });
    }
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 2000);

      this.loader = null;
    },
    async gestion_tipo_id() {
      let exis = 0;
      this.versiones = [];
      let versiones = await becasService.getVersiones(this.gestion_tipo_id);
      for (let version of versiones.data.data){
        this.versiones.push(version.version);
        if(version.version == this.version)exis ++;
      }
      if(exis <= 0 )this.version = '';
    },
  },
  methods: {
    ...mapActions(["alert"]),
    save() {
      if (this.$refs.form.validate() == true) {
        this.loader = "loading";
        this.$emit("buscar", {
          gestion_tipo_id: this.gestion_tipo_id,
          version: this.version,
        });
      }
    },
  },
};
</script>