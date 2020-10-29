<template>
  <v-row>
    <v-col
      cols="12"
      sm="4"
      v-for="(item, index) in universidades" :key="index"
    >
      <v-card class="card-animated" @click="seleccionar(item)">
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              lg="4"
              md="12"
              sm="12"
              xs="12"
            >
              <div class="text-center">
                <v-img :src=" item.imagen != 'universidades/imagen/null' ? 'http://localhost:3000/'+item.imagen : require(`../../../assets/not-image.jpg`)" width="100px"></v-img>
              </div>
            </v-col>
            <v-col
              cols="12"
              lg="8"
              md="12"
              sm="12"
              xs="12"
            >
              <h2>{{item.institucioneducativa}}</h2>
              <h4 v-text="item.nombre_sede_subsede"></h4>
              
              <div> <b>Código SIE: </b> {{item.id}} </div>
              <div> <b>Dependencia: </b> {{item.dependencia}} </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'universidad-card-list',
  props: ['universidades'],
  methods: {
    seleccionar(item){
      this.$emit('seleccionar', item.id)
    },
  }
}
</script>

<style>
  .card-animated {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2) !important;
    transition: 0.3s;
    width: 100%;
  }

  .card-animated:hover {
      box-shadow: 0 10px 20px 0 rgba(0,0,0,0.2) !important;
  }
</style>