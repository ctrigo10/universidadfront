<template>
  <v-card-text>
    <p class="body-1 text-center">
      <v-row>
         <v-col cols="12" sm="4" md="4">
          <strong>Fecha Nacimiento </strong><br />{{
            edited_item.fecha_nacimiento
          }}
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <strong>Celular </strong><br />{{
            edited_item.celular
          }}
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <strong>Correo Electrónico </strong><br />{{
            edited_item.correo
          }}
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <strong>Fecha Solicitud </strong><br />{{
            edited_item.fecha_registro
          }}
        </v-col>
        <template v-if="edited_item.fecha_modificacion != edited_item.fecha_registro">
          <v-col cols="12" sm="4" md="4" v-if="edited_item.username != ''">
            <strong>Usuario </strong><br />{{ edited_item.username }}
          </v-col>
          <v-col
            cols="12"
            sm="4"
            md="4"
            v-else-if="
              edited_item.universidad_beca_solicitud_estado == 'Cancelado'
            "
          >
            <strong>Usuario </strong><br />Estudiante
          </v-col>
          <v-col cols="12" sm="4" md="4" v-else>
            <strong>Usuario </strong><br />Automático
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <strong>Fecha Modificación </strong><br />{{
              edited_item.fecha_modificacion
            }}
          </v-col>
        </template>
      </v-row>
    </p>
    <p class="body-1 text-justify">
      <v-row v-if="edited_item.observacion">
        <v-col cols="12">
          <strong>Motivo: </strong>{{ edited_item.observacion }}
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-simple-table dense>
        <template v-slot:default>
          <tbody>
            <tr>
              <td>Calificaciones</td>
              <td>{{ edited_item.puntaje_notas }}</td>
            </tr>
            <tr>
              <td>Cuestionario</td>
              <td>{{ edited_item.puntaje_cuestionario }}</td>
            </tr>
            <tr>
              <td><strong>TOTAL</strong></td>
              <td class="body-1">
                <strong>{{ edited_item.puntaje }}</strong>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </p>
  </v-card-text>
</template>
<script>
export default {
  props: ["edited_item"],
};
</script>