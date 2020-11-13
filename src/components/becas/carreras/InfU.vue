<template>
  <v-card outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="caption">
          <v-row class="ma-0">
            <v-col cols="12" sm="6" md="4" lg="4" class="mt-n2">
              <strong class="secondary--text">Departamento: </strong
              >{{ universidad.depa }}
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="mt-n2">
              <strong class="secondary--text">Nro de resolución: </strong
              >{{ universidad.nro_resolucion }}
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="mt-n2">
              <strong class="secondary--text">Fecha de creación: </strong
              >{{ fechaCreacionSeteada }}
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="mt-n2">
              <strong class="secondary--text">Zona: </strong
              >{{ universidad.zona }}
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="mt-n2">
              <strong class="secondary--text">Dirección: </strong
              >{{ universidad.direccion }}
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="mt-n2">
              <strong class="secondary--text">Teléfono: </strong
              >{{ universidad.telefonos }}
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="mt-n2">
              <strong class="secondary--text">Sitio web: </strong
              >{{ universidad.sitio_web }}
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="mt-n2">
              <strong class="secondary--text">Fax: </strong
              >{{ universidad.fax }}
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4" class="mt-n2">
              <strong class="secondary--text">Email: </strong
              >{{ universidad.email }}
            </v-col>
          </v-row>
        </div>
      </v-list-item-content>

      <v-list-item-avatar tile size="80" color="grey">
        <v-img
          v-if="universidad.imagen == ''"
          v-bind:src="require('@/assets/beca_u_sin_imagen.svg')"
          alt="Logo Universidad"
          width="60%"
        />
        <v-img
          v-else
          class="imagen-universidad"
          :src="host + universidad.pathImage"
        ></v-img>
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
import general from "@/services/general";
export default {
  name: "Beca-universidades-informacion",
  props: ["universidad"],

  mounted() {
    this.host = general.getServe();
  },

  data: () => ({
    host: "",
  }),

  computed: {
    fechaCreacionSeteada() {
      let [year, month, day] = this.universidad.fecha_creacion.split("-");
      return `${day}/${month}/${year}`;
    },
  },
};
</script>