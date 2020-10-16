<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
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
                <v-img :src="'http://localhost:3000/'+item.imagen" width="100px"></v-img>
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
              <h4 v-html="item.id == item.sede ? 'Sede Central' : 'Sub sede'"></h4>
              <br>
              <div> <b>Código SIE: </b> {{item.id}} </div>
              <div> <b>Departamento: </b> {{item.deparmento}} </div>
              <div> <b>Distrito: </b> {{item.distrito.dist}} </div>
              <!-- <v-simple-table dense>
                <tbody>
                  <tr><th>Departamento</th><td>{{ item.departamento.depa }}</td></tr>
                  <tr><th>Distrito</th><td>{{ item.departamento.dist }}</td></tr>
                  <tr><th>Teléfonos</th><td>{{ item.telefonos }}</td></tr>
                  <tr><th>Email</th><td>{{ item.email }}</td></tr>
                  <tr><th>Sitio web</th><td>{{ item.sitio_web }}</td></tr>
                  <tr><th>Fax</th><td>{{ item.fax }}</td></tr>
                  <tr><th>Rector</th><td>{{ item.rector }}</td></tr>
                  <tr><th>Vice rector</th><td>{{ item.vicerector }}</td></tr>
                </tbody>
              </v-simple-table> -->
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