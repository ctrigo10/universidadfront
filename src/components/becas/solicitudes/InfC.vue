<template>
<div>
  <v-card outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="caption child-flex">
          <v-row>
             <v-col cols="12" sm="12" md="4" lg="4">
              <strong class="secondary--text">Departamento:</strong> {{ getUniversidad.datos.depa }}
            </v-col>
            <v-col cols="12" sm="12" md="4" lg="4">
              <strong class="secondary--text">Titulo:</strong> {{ getCarreraSolicitudes.titulo }}
            </v-col>
            <v-col cols="12" sm="12" md="4" lg="4">
              <strong class="secondary--text">Becas Disponibles:</strong> {{ getCarreraSolicitudes.cantidad_becas }}
            </v-col>
          </v-row>
        </div>
      </v-list-item-content>

      <v-list-item-avatar tile size="80" color="grey">
        <!-- <v-img
         v-if="universidad.imagen == ''"
          v-bind:src="require('@/assets/beca_u_sin_imagen.svg')"
          alt="Logo Universidad"
          width="60%"
        />-->
        <v-img
          v-bind:src="require('@/assets/beca_u_sin_imagen.svg')"
          alt="Logo Universidad"
          width="60%"
        />
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: 'Beca-universidades-solicitudes-carrera',
    computed:{
      ...mapGetters(["getCarreraSolicitudes","getUniversidad"]),
    }
}
</script>