import axios from "axios";
import general from '@/services/general'
export default{

  // FUNCIONES PARA LA PARTE PUBLICA //
  // obtener universidades activas para la parte publica solo SEDES
  async getUniversidadesActivas(){
    return await axios.get(`${general.getServe()}universidad/lista/universidades/publicas`);
  },
  // buscar universidad por nombre en la parte publica
  async buscarUniversidadNombrePublico(nombreBuscar){
    return await axios.get(`${general.getServe()}universidad/buscarUniversidad/publicas/${nombreBuscar}`);
  },
  
  // FUNCIONES PARA LA PARTE DE USUARIOS LOGUEADOS //
  // obtener universidades en base a token solo SEDES
  async getUniversidades(){
    return await axios.get(`${general.getServe()}universidad`, general.getHeader());
  },
  // buscar universidad por nombre
  async buscarUniversidadNombre(nombreBuscar){
    return await axios.get(`${general.getServe()}universidad/buscar/universidad/${nombreBuscar}`,  general.getHeader());
  },



  // ver datos unievrsidad
  async getDatosUniversidad(sie){
    if (sie) {
      return await axios.get(`${general.getServe()}universidad/${sie}`);
    }
    return false
  },
  // obtener sub sedes
  async getSubsedes(sede){
    return await axios.get(`${general.getServe()}universidad/lista/Subsedes/${sede}`);
  },


  // OPERATIVOS
  // buscar universidad por nombre
  async getOperativos(){
    return await axios.get(`${general.getServe()}universidad/lista/operativo`,  general.getHeader());
  },
  async createOperativo(data){
    return await axios.post(`${general.getServe()}universidad/operativo`, data,  general.getHeader());
  },
  async updateOperativo(id, data){
    return await axios.put(`${general.getServe()}universidad/operativo/${id}`, data,  general.getHeader());
  },
  async deleteOperativo(id){
    return await axios.delete(`${general.getServe()}universidad/operativo/${id}`,  general.getHeader());
  },




  // obtener cantidad de universidades segun su tipo 
  async getTotalesTiposUniversidades() {
    return await axios.get(general.getServe() + "informe/listaTipoUniversidades");
  },
  // obtener universidades por usuario
  async getUniversidadesUsuario(usuario){
    return await axios.get(`${general.getServe()}universidad/listaUniversidades/usuario/${usuario}`);
  },
  // actualizar datos generales de universidad
  async updateUniversidadDatosGenerales(idDatos, data){
    return await axios.put(`${general.getServe()}universidad/universidadDatos/${idDatos}`, data);
  },

  //------------------------------ CARRERAS --------------------------------*//
  // obtener carreras universidad
  async getCarrerasDenominacionesPensumsUniversidad(sie){
    return await axios.get(`${general.getServe()}universidad/listar/carreras/${sie}`);
  },
  



  async getCarrerasUniversidad(sie){
    return await axios.get(`${general.getServe()}carreraUni/carreraUniversidad/${sie}`);
  },

  //------------------------------ USUARIOS --------------------------------*//
  // obtener usuarios
  async getUsuarios(){
    return await axios.get(`${general.getServe()}universidad/lista/roles/usuario`);
  },
  // obtener usuarios
  async buscarUsuarioNombre(nombre){
    return await axios.get(`${general.getServe()}universidad/buscar/usuario/${nombre}`);
  },
  // asignar permiso de universidad al usuario
  async actualizarPermisosUniversidadUsuario(data){
    return await axios.post(`${general.getServe()}universidad/agregarUniversidad/usuario`, data);
  },
}