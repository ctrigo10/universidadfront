<template>
  <v-card-text v-if="!loading">
    <v-row>
      <v-col cols="12">
        <v-simple-table fixed-header class="mt-n5" dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Nivel</th>
                <th class="text-center">Grado</th>
                <th class="text-center">Inscripción</th>
                <th class="text-center">Opciones</th>
                <th class="text-center">Puntaje</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items[0].cursos" :key="item.curso.estudiante_inscripcion_id">
                <td>  {{ item.curso.nivel }}</td>
                <td align="center">  {{ item.curso.grado }}</td>
                <td align="center">  {{ getConvertirFecha(item.curso.fecha_inscripcion) }}</td>
                <td align="center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" @click="elegirCurso(item.materias)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Ver Calificaciones</span>
                  </v-tooltip>
                </td>
                <td align="center">  {{ item.promedio }}</td>
              <tr>
                <td colspan="4" align="center"><strong>Total</strong></td>
                <td align="center">
                  <strong>{{ items[0].promedio }}</strong>
                </td>
              </tr>
              <tr>
                <td colspan="4" align="center"><strong>Ponderación</strong></td>
                <td align="center">
                  {{ getConvocatoriaLast.ponderacion }}%
                </td>
              </tr>
              <tr>
                <td colspan="4" align="center"><strong>Punataje Final</strong></td>
                <td align="center">
                  <strong>{{edited_item.puntaje_notas}}</strong>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogNotas" width="450">
      <v-card>
       <v-toolbar flat color="secondary" dark tile height="50px">
        <v-toolbar-title>
          CALIFICACIONES
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon large>mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-toolbar>
      <v-col cols="12">
        <v-simple-table dense fixed-header class="">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Materia</th>
                <th class="text-center">Nota</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="materia in materias" :key="materia.id">
                <td>  {{ materia.materia }}</td>
                <td>  {{ materia.nota}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      </v-card>
    </v-dialog>
  </v-card-text>
  <Loading v-else />
</template>
<script>
import becasService from "@/services/becasService";
import Loading from "@/components/becas/shared/Loading";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["edited_item"],
  components: { Loading },
  created() {
    this.cargar();
  },
  data: () => ({
    items: [],
    materias: [],
    loading: false,
    dialogNotas: false,
  }),
  computed:{
      ...mapGetters(["getConvocatoriaLast","getConvertirFecha"]),
  },
  methods: {
    ...mapActions(["alert"]),
    async cargar() {
      try {
        this.loading = true;
        this.items = await becasService.getCursosInscripciones({
            estudiante_id: this.edited_item.estudiante_id,
            ultimos_cursos: this.getConvocatoriaLast.ultimos_cursos
        });
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
    elegirCurso(item){
      this.dialogNotas = true;
      this.materias = item;
    },
    close(){
      this.dialogNotas = false;
    }
  },
  watch:{
    edited_item(){
      this.cargar();
    }
  }
};
</script>