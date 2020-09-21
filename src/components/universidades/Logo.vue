<template>
  <div class="contenido-logo">
    <v-img class="logo-maximizado" :src="pathLogo" ></v-img>
    <!-- <v-img class="logo-maximizado" :src="path"></v-img> -->
    <!-- <v-img v-if="path != ''" class="logo-maximizado" :src="path"></v-img> -->

    <v-btn color="primary" block v-if="!actualizar" @click="actualizar = true"> <v-icon>mdi-pencil</v-icon> Cambiar logo </v-btn>
    <div v-if="actualizar">
      <v-form
        ref="form1"
        v-model="valid"
      >  
        <v-file-input
          label="Seleccione una imagen"
          prepend-icon="mdi-pencil"
          v-model="file"
          :rules="[v => !!v || 'El archivo es requerido']"
          @change="preview($event)"
        ></v-file-input>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="cancelar">Cancelar</v-btn>
          <v-btn color="primary" @click="update">Aceptar</v-btn>
        </v-card-actions>
      </v-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'logo',
  props: ['idUniversidad','logo'],
  data: () => ({
    path: '',
    actualizar: false,
    valid: true,
    file: ''
  }),
  computed: {
    pathLogo(){
      if (this.path == '') {
        if (this.logo == '') {
          return null;
        }
        return this.logo;
      }else{
        return this.path;
      }
    }
  },
  mounted(){
    this.actualizar = false;
  },
  methods : {
    preview(){
      this.path = URL.createObjectURL(this.file);
    },
    cancelar(){
      this.path = '';
      this.file = '';
      this.actualizar = false;
    },
    update(){
      if (this.$refs.form1.validate()) {
        let data = new FormData();
        data.append('file', this.file)
        axios.put(`http://localhost:3000/universidad/imagenLogo/${this.idUniversidad}`, data).then(response => {
          if (response.data.status == 'success') {
            this.actualizar = false;
            this.file = '';
            this.$emit('recargarLogo', true);
          }
        }).catch(() => {
          console.log('Error al actualizar el logo');
        })
      }
    },
    deleted(){
      
    }
  }
}
</script>
<style scope>
.contenido-logo{
  padding-top: 20px;
}
  .logo-maximizado {
    display: block;
    width: 100%;
    height: auto;
    min-height: 350px;
    background-color: #FFFFFF;
  }
</style>