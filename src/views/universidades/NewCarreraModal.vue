<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Nuevo
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          Agregar Carrera
        </v-card-title>

        <v-card-text>
          <template>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      outlined
                      dense
                      label="Carrera"
                      v-model="nombreCarrera"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </template>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="secondary"
            text
            @click="registrar"
          >
            Registrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        nombreCarrera: ''
      }
    },
    methods: {
      registrar(){
        alert(this.nombreCarrera);
      }
    }
  }
</script>