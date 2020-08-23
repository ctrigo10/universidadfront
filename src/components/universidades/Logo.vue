<template>
  <div>
    <!-- <v-img src="http://localhost:3000/universidades/imagen/img-1597759284112.png" class="logo-universidad" @click="logoDialog = false"></v-img> -->
    <v-img :src="path" class="logo-universidad" @click="logoDialog = true"></v-img>
    <!-- <v-btn color="success" @click="logo.name = 'img-1597759284112.png'">Cambiar desde logo</v-btn> -->
    <!-- {{numero}} -->
    <span style="display:none">{{nombreLogo}} {{logo.name}}</span>
    <v-dialog
      v-model="logoDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-text>
          <v-img class="logo-maximizado" src=""></v-img>
          <v-file-input
            hide-input="true"
            prepend-icon="mdi-pencil"
            class="btn-accion"
            v-model="logo.file"
          ></v-file-input>
          <v-btn class="btn-accion" @click="update"> <v-icon>mdi-pencil</v-icon> </v-btn>
          <v-btn class="btn-accion"> <v-icon>mdi-delete</v-icon> </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'logo',
  data: () => ({
    logoDialog: false,
    path: '',
    numero: 0,
    logo: {
      name: '',
      file: ''
    }
  }),
  props: ['idUniversidad','nombreLogo'],
  updated(){
    this.logo.name = this.nombreLogo;
    console.log('editando')
    this.getLogo();
  },
  methods : {
    aumentar(){
      this.numero = this.numero + 1;
      console.log(this.numero)
    },
    getLogo(){
      // axios.get(`http://localhost:3000/universidad/verRutaImg/${this.idUniversidad}`).then(response => {
      //   console.log(response)
      // })
      if (this.logo.name != null && this.logo.name != '') {
        axios.get(`http://localhost:3000/universidad/imagen/${this.logo.name}`).then(response => {
          this.path = response.data;
          console.log(response)
        })
      }else{
        console.log('Nombre vacio')
      }
    },
    update(){
      if (this.logo.file != '') {
        let data = new FormData();
        data.append('file', this.logo.file)
        axios.put(`http://localhost:3000/universidad/imagenLogo/${this.idUniversidad}`, data).then(response => {
          console.log(response);
          this.getLogo();
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
  .logo-universidad {
    width: 70px;
    height: 70px;
    background-color: #EEEEEE;
    cursor: pointer;
  }
  .logo-maximizado {
    display: block;
    width: 100%;
    height: auto;
    min-height: 350px;
    background-color: #FFFFFF;
  }
</style>