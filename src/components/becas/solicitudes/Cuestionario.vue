<template>
  <v-card-text v-if="!loading">
    <p class="body-1 text-center">
      <v-simple-table fixed-header dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Pregunta</th>
              <th class="text-center">Respuesta</th>
              <th class="text-center">Archivo</th>
              <th class="text-center">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.bcresp.bcuestionario.pregunta }}</td>
              <td>{{ item.bcresp.respuesta }}</td>
              <td v-if="item.pathFile">
                <a :href="host + item.pathFile" target="_blank"
                  ><v-icon>mdi-file-eye</v-icon></a
                >
              </td>
              <td v-else>-</td>
              <td>{{ item.bcresp.puntaje }}</td>
            </tr>
            <tr>
              <td colspan="3"><strong>TOTAL</strong></td>
              <td>
                <strong>{{ edited_item.puntaje_cuestionario }}</strong>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </p>
  </v-card-text>
  <Loading v-else />
</template>
<script>
import becasService from "@/services/becasService";
import Loading from "@/components/becas/shared/Loading";
import { mapActions } from "vuex";
export default {
  props: ["edited_item"],
  components: { Loading },
  created() {
    this.cargar();
    this.host = becasService.getBaseBeca();
  },
  data: () => ({
    items: [],
    loading: false,
    host: "",
  }),
  methods: {
    ...mapActions(["alert"]),
    async cargar() {
      try {
        this.loading = true;
        this.items = await becasService.getRespuestasBySolicitud(
          this.edited_item.universidad_beca_solicitud_id
        );
        this.items = this.items.data.data;
      } catch (error) {
        let texto = error;
        if (error.response) texto = error.response.data;
        this.alert({
          text: texto,
          color: "red",
        });
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    edited_item() {
      this.cargar();
    },
  },
};
</script>