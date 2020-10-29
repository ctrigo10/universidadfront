import axios from "axios";
import general from '@/services/general'
export default{

  //////////////////////////// CLASIFICADORES ////////////////////////
  // obtener departamentos
  async getDepartamentos(){
    return await axios.get(`${general.getServe()}universidad/departamentos/list`);
  },
  // obtener provincias
  async getProvincias(idDepartamento){
    return await axios.get(`${general.getServe()}universidad/provincias/${idDepartamento}`);
  },
  // obtener secciones
  async getSecciones(idProvincia){
    return await axios.get(`${general.getServe()}universidad/secciones/${idProvincia}`);
  },

  // obtener distritos
  async getDistritos(idDepartamento){
    return await axios.get(`${general.getServe()}universidad/distritos/${idDepartamento}`);
  },
  
  // obtener estados de la universidad (abierto, cerrado)
  async getEstados(){
    return await axios.get(`${general.getServe()}universidad/estados/list`);
  },
  
  // obtener dependencias (privado, publico, etc)
  async getDependencias(){
    return await axios.get(`${general.getServe()}universidad/dependencias/list`);
  },
  

  // ////////////////////////////// UNIVERSIDAD //////////////////////////
  // crear universidad
  async createUniversidad(data){
    return await axios.post(`${general.getServe()}universidad`, data);
  },
  async updateUniversidad(id, data){
    return await axios.put(`${general.getServe()}universidad/${id}`, data);
  },

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
    console.log('asdfasdfsadf')
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
  // obtener sedes
  async getSedes(){
    return await axios.get(`${general.getServe()}universidad/sedes/list`);
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

  

  //------------------------------- DASHBOARD --------------------------------------------//
  // obtener cantidad de universidades segun su tipo 
  async getTotalesTiposUniversidades() {
    return await axios.get(general.getServe() + "informe/listaTipoUniversidades");
  },
  
  // obtener cantidad de universidades por departamento y tipo
  async getCantidadUniversidadesDepartamentoTipo() {
    return await axios.get(general.getServe() + "informe/listaCuadro/departamento");
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

  //------------------------------ CLASIFICADORES --------------------------------*//
  async getNiveles(){
    return await axios.get(`${general.getServe()}carreraUni/nivelTipo/list`);
  },
  async getRegimenes(){
    return await axios.get(`${general.getServe()}carreraUni/regimenEstudio/list`);
  },
  async getPeriodosMateria(){
    return await axios.get(`${general.getServe()}universidad/lista/periodos`);
  },


  //------------------------------ TRAMITES --------------------------------*//
  // listar tipos de tramites
  async getTiposTramites(){
    return await axios.get(`${general.getServe()}tramite/tramiteTipos`);
  },
  // listar tramites segun el tipo
  async getListaTramites(tipo, idUniversidad){
    let usuario = general.getUser();
    let rol = usuario.roles[0].rol_tipo_id
    if(rol == 48) {
      idUniversidad = 'TODOS'
    }
    return await axios.get(`${general.getServe()}tramite/${tipo}/${idUniversidad}`, general.getHeader());
  },
  // Obtener la bitacora del tramite
  async getBitacoraTramite(idTramite){
    return await axios.get(`${general.getServe()}tramite/bitacoras/${idTramite}`, general.getHeader());
  },
  
  // Obtener los ultimos datos json del trámite para hacer el registro
  async getDatosJson(idTramite){
    return await axios.get(`${general.getServe()}tramite/datos/${idTramite}`, general.getHeader());
  },


  //////////////////////////////////// PASOS PARA ENVIAR /////////////////////////////////////////////////
  
  // Solicitar token
  async solicitarToken(data){
    return await axios.post(`${general.getServe()}tramite`, data, general.getHeader());
  },
  // Solicitar creacion de carrera o denominacion
  async enviarFormularioInicioTramite(data){
    return await axios.post(`${general.getServe()}tramite`, data, general.getHeader());
  },
  // Recepcionar tramite
  async recepcionarTramite(data){
    return await axios.post(`${general.getServe()}tramite`, data, general.getHeader());
  },
  // Enviar tramite
  async enviarTramite(data){
    return await axios.post(`${general.getServe()}tramite`, data, general.getHeader());
  },
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  // Registrar datos del tramite nueva carrera
  async createNuevaCarrera(data){
    return await axios.post(`${general.getServe()}universidad/agregar/CarreraMateria`, data, general.getHeader());
  },
  // Registrar datos del tramite nueva denominacion
  async createNuevaDenominacion(data){
    return await axios.post(`${general.getServe()}universidad/agregarDenominacion/Carrera`, data, general.getHeader());
  },


  

  //////////////////////////////////// UTILIDADES ///////////////////////////////////////////////////////}
  verificarPermisoRol(rol){
    let idRol = null;
    switch (rol) {
      case 'universidad':
        idRol = 51;
        break;
      case 'tecnico':
        idRol = 48;
        break;
    }
    let user = general.getUser()
    if (user) {
      let rolUsuario = user.roles.find(rol => rol.rol_tipo_id == idRol)
      if (rolUsuario) {
        return true
      }
    }
    return false
  }
  
}