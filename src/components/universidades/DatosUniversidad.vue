<template>
  <div>
    <v-card class="tarjeta">
      <v-card-text>
        <div class="text-center">
          <h1 class="jupper">{{universidad.institucioneducativa}}</h1>
          Código SIE: {{idUniversidad}}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'datos-universidad',
  props: ['idUniversidad'],
  data: () => ({
    status: true,
    universidad: {
      id: '',
      codDepartamento: '',
      codProvincia: '',
      codSeccion: '',
      zona: '',
      direccion: '',

      estadoinstitucion_tipo_id: '',
      dependencia_tipo_id: '',
      institucioneducativa_tipo_id: 1,
      institucioneducativa: '',
      fecha_resolucion: '2020-05-02',
      nro_resolucion: '123213',
      fecha_creacion: '',

      telefonos: '',
      fax: '',
      email: '',
      sitio_web: '',
      decreto_supremo: '',
      fecha_decreto_supremo: '',
      tipoSede: 'sede',
      iduniversidadSede: ''
    },
  }),
  updated(){
    this.getDatosUniversidad();
    console.log('idUniversidad')
  },
  methods: {
    getDatosUniversidad(){
      axios.get(`http://localhost:3000/universidad/${this.idUniversidad}`).then(response => {
        this.status = !this.status;
        if (response.data.status == 'success') {
          let univData = response.data.data;
          let datos = response.data.datos;


          this.universidad.id = univData.id;
          this.universidad.codDepartamento = '';
          this.universidad.codProvincia = '';
          this.universidad.codSeccion = '';
          this.universidad.zona = '';
          this.universidad.direccion = '';

          this.universidad.estadoinstitucion_tipo_id = univData.estadoinstitucion_tipo_id;
          this.universidad.dependencia_tipo_id = univData.dependencia_tipo_id;
          this.universidad.institucioneducativa = univData.institucioneducativa;
          this.universidad.fecha_resolucion = '2020-05-02',
          this.universidad.nro_resolucion = '123213',
          this.universidad.fecha_creacion = univData.fecha_creacion;

          this.universidad.estadoText = univData.estadoinstitucion_tipo.estadoinstitucion;
          this.universidad.dependenciaText = univData.dependencia_tipo.dependencia;

          if(datos != null){
            this.universidad.telefonos = datos.telefonos;
            this.universidad.fax = datos.fax;
            this.universidad.email = datos.email;
            this.universidad.sitio_web = datos.sitio_web;
            this.universidad.decreto_supremo = datos.decreto_supremo;
            this.universidad.fecha_decreto_supremo = datos.fecha_decreto_supremo;
          }
        }
      }).catch( () => {
        console.log('Error al obtener los datos')
      });
    },
  }
}
</script>
<style scope>
.jupper{
  text-transform: uppercase;
}
  .titulo {
    /* font-size: 1.2em; */
  }
  h5 {
    font-size: 1.1em;
    min-height: 30px;
    color: gray;
  }
</style>