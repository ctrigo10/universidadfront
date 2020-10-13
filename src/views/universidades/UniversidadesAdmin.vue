<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Administración
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <!-- <v-row>
          <v-col
            sm="6"
          >
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar universidad"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <br>

        <v-data-table
          :headers="headers"
          :items="universidades"
          class="elevation-1"
          pagination.sync="pagination"
          item-key="id"
          loading="true"
          :search="search"
        >
          <template v-slot:[`item.imagen`]="{ item }">
            <img :src="'http://localhost:3000/' + item.imagen" alt="" class="logo-lista" >
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <v-btn @click="edit(item)" small color="secondary" elevation="5">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </template>
        </v-data-table> -->

        <v-row>
          <v-col
            cols="12"
            sm="6"
            v-for="(item, index) in universidades" :key="index"
          >
            <v-card class="card-animated">
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
                    <br>
                    <v-simple-table dense>
                      <tbody>
                        <tr><th>Departamento</th><td>{{ item.departamento.depa }}</td></tr>
                        <tr><th>Dirección</th><td>{{ item.direccion }}</td></tr>
                        <tr><th>Teléfonos</th><td>{{ item.telefonos }}</td></tr>
                        <tr><th>Email</th><td>{{ item.email }}</td></tr>
                        <tr><th>Sitio web</th><td>{{ item.sitio_web }}</td></tr>
                        <tr><th>Fax</th><td>{{ item.fax }}</td></tr>
                        <tr><th>Rector</th><td>{{ item.rector }}</td></tr>
                        <tr><th>Vice rector</th><td>{{ item.vicerector }}</td></tr>
                      </tbody>
                    </v-simple-table>
                  </v-col>
                </v-row>
                <div class="text-right">
                  <v-btn color="primary" @click="edit(item)"> Editar</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>

    <v-dialog
      v-model="dialogUniversidad"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Actualizar datos
        </v-card-title>
        <v-card-text>
          <v-text-field
            name="name"
            label="Teléfonos"
            v-model="universidad.telefonos"
          ></v-text-field>
          <v-text-field
            name="name"
            label="Email"
            v-model="universidad.email"
          ></v-text-field>
          <v-text-field
            name="name"
            label="Sitio Web"
            v-model="universidad.sitio_web"
          ></v-text-field>
          <v-text-field
            name="name"
            label="Fax"
            v-model="universidad.fax"
          ></v-text-field>
          <v-text-field
            name="name"
            label="Rector"
            v-model="universidad.rector"
          ></v-text-field>
          <v-text-field
            name="name"
            label="Vice rector"
            v-model="universidad.vicerector"
          ></v-text-field>
          <v-text-field
            name="name"
            label="Direccion"
            v-model="universidad.direccion"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogUniversidad = false">Cancelar</v-btn>
          <v-btn color="primary" @click="update">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import Service from '@/services/general'
import UniversidadesService from '@/services/universidadesService'
import { mapMutations } from 'vuex';
export default {
  name: 'universidades-admin',
  data: () => ({
    usuario: '',
    universidades: [],
    headers: [
      { text: '', value: 'imagen', sortable: false},
      { text: 'Universidad', value: 'institucioneducativa'},
      { text: 'Departamento', value: 'departamento.depa'},
      { text: 'Dirección', value: 'direccion'},
      { text: 'Teléfonos', value: 'telefonos'},
      { text: 'Email', value: 'email'},
      { text: 'Sitio Web', value: 'sitio_web'},
      { text: 'Fax', value: 'fax'},
      { text: 'Rector', value: 'rector'},
      { text: 'Vice Rector', value: 'vicerector'},
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
    ],
    search: '',
    universidad: '',
    dialogUniversidad: false
  }),
  mounted(){
    this.usuario = Service.getUser();
    this.obtenerUniversidades();
  },
  methods: {
    ...mapMutations(['uniAlert']),
    async obtenerUniversidades(){
      try {
        let response = await UniversidadesService.getUniversidadesUsuario(this.usuario.uid);
        let data = await response.data;
        this.universidades = data.data;
        console.log('us usuario', this.universidades)
      } catch (error) {
        console.log(error);
      }
    },
    edit(item){
      this.universidad = item;
      console.log('editando', item)
      this.dialogUniversidad = true
    },
    async update(){
      try {
        let response = await UniversidadesService.updateUniversidadDatosGenerales(this.universidad.id, this.universidad);
        let data = await response.data;
        console.log(data);
        if (data.status == 'success') {
          this.uniAlert({ color: 'success', text: 'Registro actualizado correctamente' });
          this.obtenerUniversidades();
          this.dialogUniversidad = false;
        }else{
          this.uniAlert({ color: 'error', text: 'Error al actualizar el registro' });
        }
      } catch (error) {
        console.log(error);
        this.uniAlert({ color: 'error', text: 'Error al actualizar el registro' });
      }
    },
  }
}
</script>

<style>
  .logo-lista {
    width: 40px;
  }
  .label-title {
    margin-right: 20px;
  }
  .card-animated {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2) !important;
    transition: 0.3s;
    width: 100%;
  }

  .card-animated:hover {
      box-shadow: 0 10px 20px 0 rgba(0,0,0,0.2) !important;
  }

</style>