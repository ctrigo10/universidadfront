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
  // actualizar universidad
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
  // y tambien sedes de las subsedes de las que tiene permisos
  async getUniversidades(){
    return await axios.get(`${general.getServe()}universidad`, general.getHeader());
  },
  // buscar universidad por nombre
  async buscarUniversidadNombre(nombreBuscar){
    return await axios.get(`${general.getServe()}universidad/buscar/universidad/${nombreBuscar}`,  general.getHeader());
  },



  // ver datos universidad
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
  // obtener sedes y subsedes de una universidad
  async getSedesSubsedesUniversidad(idUniversidad){
    return await axios.get(`${general.getServe()}universidad/sedesSubsedes/${idUniversidad}`, general.getHeader());
  },
  // obtener todas las sedes y subsedes regsitradas - para asignacion de permisos
  async getTodasSedesSubsedes(){
    return await axios.get(`${general.getServe()}universidad/sedesSubsedes`, general.getHeader());
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
  
  async getRecordAcademicoCarnet(carnet=null, carrera_autorizada_id=null, estudiante_id=null){

    let params = '?';
    if (carnet != null) {
      params += `carnet=${carnet}`
    }
    if (carrera_autorizada_id != null) {
      params += `carrera_autorizada_id=${carrera_autorizada_id}&estudiante_id=${estudiante_id}`
    }

    // let response = await axios.get(`${general.getServe()}informe/listaEstudianteCarnet/${carnet}`);
    let response = await axios.get(`${general.getServe()}informe/listaRecordsEstudiante${params}`);
    let data = response.data
    if (data.status == 'success') {
      let datos = data.data
      let records = []
      datos.universidades.map(universidad => {
        universidad.carreras.map(carrera => {
          records.push({
            universidad: universidad.nombre,
            carrera: carrera.nombre,
            estudiante: `${datos.nombre} ${datos.paterno} ${datos.materno}`,
            carnet: `${datos.carnet} ${datos.complemento}`,
            materias: []// carrera.materias.length > 0 ? carrera.materias : []
          })
        })
      })
      return records
    }

    return []
  },

//------------------------------ ESTUDIANTE --------------------------------*//
  // buscar estudiante
  async getEstudiante(carnet, complemento){
    if (complemento != '') {
      return await axios.get(`${general.getServe()}informe/estudiante?carnet=${carnet}&complemento=${complemento}`);
    }
    return await axios.get(`${general.getServe()}informe/estudiante?carnet=${carnet}`);
  },

  // obtener recors academicos
  async getRecordAcademico(estudiante_id = null, carrera_autorizada_id = null, carnet = null){
    let url;
    if (carnet === null || carnet == undefined) {
      url = `${general.getServe()}informe/listaRecordsEstudiante?carrera_autorizada_id=${carrera_autorizada_id}&estudiante_id=${estudiante_id}`
    }else{
      url = `${general.getServe()}informe/listaRecordsEstudiante?carnet=${carnet}`
    }
    let response = await axios.get(url);
    let data = response.data
    console.log('dfasdfadsf', data)
    if (data.status == 'success') {
      let datos = data.data
      let records = []
      datos.universidades.map(universidad => {
        universidad.carreras.map(carrera => {
          records.push({
            universidad: universidad.nombre,
            carrera: carrera.nombre,
            estudiante: `${datos.nombre} ${datos.paterno} ${datos.materno}`,
            paterno: datos.paterno,
            materno: datos.materno,
            nombre: datos.nombre,
            carnet: `${datos.carnet} ${datos.complemento}`,
            materias: carrera.materias.length > 0 ? carrera.materias : []
          })
        })
      })
      return records
    }

    return []
  },




  //---------------------------------------------------- -------- ----------------------------------------------------------*//
  //---------------------------------------------------- USUARIOS ----------------------------------------------------------*//
  //---------------------------------------------------- -------- ----------------------------------------------------------*//

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

  //------------------------------------------------- END USUARIOS ----------------------------------------------------------*//


  //---------------------------------------------------- -------- ----------------------------------------------------------*//
  //---------------------------------------------------- TRAMITES ----------------------------------------------------------*//
  //---------------------------------------------------- -------- ----------------------------------------------------------*//

  // listar tipos de tramites
  async getTramite(idTramite){
    return await axios.get(`${general.getServe()}tramite/${idTramite}`);
  },

  // listar tipos de tramites
  async getTiposTramites(){
    return await axios.get(`${general.getServe()}tramite/tramiteTipos`);
  },

  // listar tramites segun el tipo
  async getListaTramites(tipo){
    let usuario = general.getUser();
    let rol = usuario.roles[0].rol_tipo_id
    if(rol == 48) {
      return await axios.get(`${general.getServe()}tramite/${tipo}/TODOS`, general.getHeader());
    }
    // return await axios.get(`${general.getServe()}tramite/${tipo}/${idUniversidad}`, general.getHeader());
    return await axios.get(`${general.getServe()}tramite/${tipo}/UNIVERSIDAD`, general.getHeader());
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
  // Registrar datos del tramite nueva denominacion
  async createNuevoToken(data){
    return await axios.post(`${general.getServe()}universidad/tokenUniversidad`, data, general.getHeader());
  },


  //------------------------------------------------ END TRAMITES ----------------------------------------------------------*//


  

  //---------------------------------------------------- -------- ----------------------------------------------------------*//
  //---------------------------------------------------- UTILIDADES ---------------------------------------------------------*//
  //---------------------------------------------------- -------- ----------------------------------------------------------*//

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
  },

  //--------------------------------------------------END UTILIDADES ---------------------------------------------------------*//

  //---------------------------------------------------- -------- ----------------------------------------------------------*//
  //-------------------------------------------------- FORMULARIOS ---------------------------------------------------------*//
  //---------------------------------------------------- -------- ----------------------------------------------------------*//

  // Formulario 1
  async getListForm1(idUniversidad){
    if (idUniversidad !== 'ninguno') {
      return await axios.get(`${general.getServe()}formulario?universidad=${idUniversidad}`);
    }
    return await axios.get(`${general.getServe()}formulario`);
  },
  async createForm1(data){
    return await axios.post(`${general.getServe()}formulario`, data, general.getHeader());
  },
  async updateForm1(id, data){
    return await axios.put(`${general.getServe()}formulario/${id}`, data);
  },
  async deleteForm1(id){
    return await axios.delete(`${general.getServe()}formulario/${id}`);
  },
  
  // Formulario 3
  async getListForm3(idUniversidad){
    if (idUniversidad !== 'ninguno') {
      return await axios.get(`${general.getServe()}formulario/form3?universidad=${idUniversidad}`);
    }
    return await axios.get(`${general.getServe()}formulario/form3`);
  },
  async getForm3(id){
    return await axios.get(`${general.getServe()}formulario/form3/${id}`);
  },
  async createForm3(data){
    return await axios.post(`${general.getServe()}formulario/form3`, data);
  },
  async updateForm3(id, data){
    return await axios.put(`${general.getServe()}formulario/form3/${id}`, data);
  },
  async deleteForm3(id){
    return await axios.delete(`${general.getServe()}formulario/form3/${id}`);
  },
  
  // Formulario 5
  async getListForm5(idUniversidad){
    if (idUniversidad !== 'ninguno') {
      return await axios.get(`${general.getServe()}formulario/form5?universidad=${idUniversidad}`);
    }
    return await axios.get(`${general.getServe()}formulario/form5`);
  },
  async getForm5(id){
    return await axios.get(`${general.getServe()}formulario/form5/${id}`);
  },
  async createForm5(data){
    return await axios.post(`${general.getServe()}formulario/form5`, data);
  },
  async updateForm5(id, data){
    return await axios.put(`${general.getServe()}formulario/form5/${id}`, data);
  },
  async deleteForm5(id){
    return await axios.delete(`${general.getServe()}formulario/form5/${id}`);
  },

  //----------------------------------------------- END FORMULARIOS ---------------------------------------------------------*//
}