<template>
  <v-card class="mx-auto" color="secondary lighten-2" dark>
    <v-card-title v-if="from=='seguimiento'">
      <v-icon large left>mdi-message</v-icon>
      <span class="title font-weight-light">BECAS SOCIALES</span>
    </v-card-title>
    <v-card-text class="white--text">
    <p class="body-1 text-justify">{{ mensaje }}</p>
    <v-divider class="mt-3"></v-divider>
    <!-- para cancelar la solicitud -->
      <div v-if="from == 'solicitud' && id != 0">
        Si desea cancelar su solicitud haga click <a class="white--text" @click="mostrarFormCancelar"><strong>aqui</strong></a>
        <div v-if="formCancelar">
          <v-form ref="form" lazy-validation>
            <v-textarea
              clearable
              clear-icon="mdi-close-circle"
              label="Motivo por el cual se cancela la solicitud."
              counter
              auto-grow
              v-model="observacion"
              :rules="[rules.required]"
              required
              color="white"
            >
            </v-textarea>
             <v-btn block color="white" @click="cancelarSolicitud" class="secondary--text">Cancelar solicitud de Beca</v-btn>
          </v-form>
        </div>
      </div>
    <!-- -->
    <p v-if="from=='seguimiento'" class="body-2">"Por un Pacto Nacional para la Modernización Educativa"</p>
    </v-card-text>
  </v-card>
</template>

<script>
import becasService from "@/services/becasService";
import { mapActions } from "vuex";
export default {
    props:["mensaje","from","id"],
    name: "beca-mensaje",
    data(){
      return {
        formCancelar: false,
        observacion: '',
        rules: {
          required: (value) => !!value || "Requerido",
        }
      }
    },
    methods:{
      ...mapActions(["alert"]),
      mostrarFormCancelar(){
        this.formCancelar = true;
      },
      cancelarSolicitud(){
         if (this.$refs.form.validate() == true) {
          this.$vuetifyConfirmDialog
            .open("Confirmación", "¿Está seguro de cancelar su solicitud de beca?, todos los datos son registrados por seguridad.", "Cancelar", "Confirmar", "primary", "secondary")
            .then(state => {
                if (state == true)
                  this.confirmCancelar();
            });
         }
      },
      async confirmCancelar(){
        try{
          await becasService.cancelSolicitud({
            id: this.id,
            observacion: this.observacion
          });
          this.$router.push({ name: 'becas-seguimiento' });
          this.alert({
            text: "Solicitud de beca cancelada.",
            color: "primary"
          });
        }catch(error){
          let texto = error;
            if(error.response)texto =  error.response.data;
            this.alert({
                text: texto,
                color: "red"
            });
        }
      }
    }
}
</script>