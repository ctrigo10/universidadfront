import axios from "axios";
import general from '@/services/general'
export default{
    getBaseBeca() {
        return general.getServe() + "beca/";
        //return "http://localhost:3000/beca/"
      },

    getBaseBecaConvocatoria() {
        return this.getBaseBeca() + "convocatoria/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaUniversidad() {
        return this.getBaseBeca() + "universidad/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaCarrera() {
        return this.getBaseBeca() + "carrera/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaUsuario() {
        return this.getBaseBeca() + "usuario/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaCuestionario() {
        return this.getBaseBeca() + "cuestionario/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaCuestionarioRespuesta() {
        return this.getBaseBeca() + "cuestionario/respuesta/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaCondicion() {
        return this.getBaseBeca() + "condicion/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaConsulta(){
          return this.getBaseBeca() + "consulta/";
      },

      getBaseBecaSolicitud(){
        return this.getBaseBeca() + "solicitud/";
      },

      getBaseBecaSolicitudes(){
        return this.getBaseBeca() + "solicitudes/";
      },

      getBaseBecaPuntaje(){
        return this.getBaseBeca() + "puntajes/";
      },

      getBaseBecaEscritorio(){
        return this.getBaseBeca() + "escritorio/";
      },

    //Convocatorias esta gestion
        getConvocatoriasActual(){
            return axios.get(this.getBaseBecaConvocatoria() + "actual");
        },

        addConvocatoria(item){
            return axios.post(this.getBaseBecaConvocatoria(),item, general.getHeader());
        },

        editConvocatoria(item){
            return axios.put(this.getBaseBecaConvocatoria() + item.id, item, general.getHeader());
        },

        deleteConvocatoria(item){
            return axios.delete(this.getBaseBecaConvocatoria() + item.id, general.getHeader());
        },

    //Univesidades Todos
        /*getUniversidades(options){
            return axios.get(this.getBaseBeca() + "universidades" ,{
                params: options
            });
        },*/
        getUniversidades(options){
            return axios({
                method: 'get',
                url: this.getBaseBeca() + 'universidades',
                params: options,
                headers: { "Authorization": general.getToken() }
            })
        },
        getUniversidadesList(){
            return axios.get(this.getBaseBeca() + "universidades/lista");
        },

    //Universidad
        addUniversidad(item){
            return axios.post(this.getBaseBecaUniversidad(), item, general.getHeader());
        },

        editUniversidad(item){
            return axios.put(this.getBaseBecaUniversidad() + item.id, item, general.getHeader());
        },

        getUniversidad(item){
            return axios.get(this.getBaseBecaUniversidad() + item.id);
        },

        getCarrerasByUniversidad(item){
            return axios.get(this.getBaseBecaUniversidad() + item + "/carreras");
        },

        getCarrerasBecasByUniversidad(item){
            return axios.get(this.getBaseBecaUniversidad() + item + "/becas");
        },

    //Carreras
        addCarrera(item){
            return axios.post(this.getBaseBecaCarrera(), item, general.getHeader());
        },

        editBecaCarrera(item){
            return axios.put(this.getBaseBecaCarrera() + item.universidad_beca_carrera_id, item, general.getHeader());
        },

        deleteCarrera(item){
            return axios.delete(this.getBaseBecaCarrera() + item.universidad_beca_carrera_id, general.getHeader());
        },

    //Usuarios
        getUsuarios(){
            return axios.get(this.getBaseBecaUsuario());
        },

        addUniversidadesUsuario(datos){
            return axios.post(this.getBaseBecaUsuario(), datos, general.getHeader());
        },
    //Cuestionario
        getPreguntas(item){
            return axios.get(this.getBaseBecaCuestionario() + "convocatoria/" + item, general.getHeader());
        },
        addPregunta(item){
            return axios.post(this.getBaseBecaCuestionario(), item, general.getHeader());
        },
        editPregunta(item){
            return axios.put(this.getBaseBecaCuestionario() + item.id, item, general.getHeader());
        },
        deletePregunta(item){
            return axios.delete(this.getBaseBecaCuestionario() + item.id, general.getHeader());
        },
        addRespuesta(item){
            return axios.post(this.getBaseBecaCuestionarioRespuesta(), item, general.getHeader());
        },
        editRespuesta(item){
            return axios.put(this.getBaseBecaCuestionarioRespuesta() + item.id, item, general.getHeader());
        },
        deleteRespuesta(item){
            return axios.delete(this.getBaseBecaCuestionarioRespuesta() + item.id, general.getHeader());
        },
        getCondiciones(item){
            return axios.get(this.getBaseBecaCondicion() + "convocatoria/" + item);
        },
        addCondicion(item){
            return axios.post(this.getBaseBecaCondicion(), item, general.getHeader());
        },
        editCondicion(item){
            return axios.put(this.getBaseBecaCondicion() + item.id, item.item, general.getHeader());
        },
        deleteCondicion(item){
            return axios.delete(this.getBaseBecaCondicion() + item.id, general.getHeader());
        },
        getRespuestasBySolicitud(item){
            return axios.get(this.getBaseBeca() + "respuestas/solicitud/" + item, general.getHeader());
        },
        getSolicitudPdf(item){
            return axios.get(this.getBaseBecaSolicitud() + item + "/pdf/");
        },
        getCursosInscripciones(item){
            return axios.post(this.getBaseBeca() + "cursos" ,item, general.getHeader());
        },
        getEstudianteBySolicitud(item){
            return axios.get(this.getBaseBecaSolicitud() + item + "/estudiante/");
        },
    //Consulta estudiante
        getEstudiante(item){
            return axios.post(this.getBaseBecaConsulta() + "solicitud/", item);
        },
        cancelSolicitud(item){
            return axios.put(this.getBaseBecaSolicitud() + item.id, item);
        },
        getEstadosList(){
            return axios.get(this.getBaseBeca() + "solicitud_estados");
        },
        getEstadosListContador(item){
            return axios.get(this.getBaseBeca() + "solicitudes/contador/carrera/" + item, general.getHeader());
        },
        editSolicitud(item){
            return axios.put(this.getBaseBeca() + "solicitud_estados", item.item , general.getHeader());
        },
    //solicitar Beca
        addSolicitud(item){
            return axios.post(this.getBaseBecaSolicitud(), item);
        },
    //Obtener todas las solicitudes de una carrera
        getCarreraSolicitudesBecas(item){
            return axios({
                method: 'get',
                url: this.getBaseBecaSolicitudes(),
                params: item,
                headers: { "Authorization": general.getToken() }
            })
        },
    //Obtener Puntajes
        getPuntajes(item){
            return axios.get(this.getBaseBecaPuntaje() + "solicitud/" + item, general.getHeader());
        },
    //Finalizar Convocatoria (obtener validados y rechazados automáticamente)
        convocatoriaFinish(item){
            return axios.put(this.getBaseBeca() + "finalizar/convocatoria", item, general.getHeader());
        },
    //Escritorio
        getEscritorioCantidades(item){
            return axios({
                method: 'get',
                url: this.getBaseBecaEscritorio() + "cantidades/",
                params: item,
                headers: { "Authorization": general.getToken() }
            })
        },
        getUniversidadesByCantidadEstado(item){
            return axios({
                method: 'get',
                url: this.getBaseBecaEscritorio() + "universidades/",
                params: item,
                headers: { "Authorization": general.getToken() }
            })
        },
        getSolicitudesPdf(item){
            return axios({
                method: 'get',
                url: this.getBaseBecaEscritorio() + "pdf/",
                params: item,
                headers: { "Authorization": general.getToken() }
            })
        },
        getSolicitudesResumenPdf(item){
            return axios.get(this.getBaseBecaEscritorio() + "resumen/pdf/" + item, general.getHeader());
        },
        getGestiones(){
            return axios.get(this.getBaseBeca() + "gestiones/");
        },
        getVersiones(gestion){
            return axios.get(this.getBaseBeca() + "versiones/" + gestion);
        },
};