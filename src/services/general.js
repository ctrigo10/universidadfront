export default {
  getServe() {
    if (process.env.NODE_ENV === "production") {
      return "http://51.161.10.36:5000/";
    } else {
      return "http://localhost:3000/";
    }
  },
  getBasePre() {
    return this.getServe() + "preuniversitario/";
  },
  getLogin() {
    return this.getServe() + "login/";
  },
  setToken(token) {
    return sessionStorage.setItem("token", token);
  },
  getToken() {
    return "Bearer " + sessionStorage.getItem("token");
  },
  removeToken() {
    return sessionStorage.removeItem("token");
  },
  setUser(user) {
    return sessionStorage.setItem(
      "tyuia",
      JSON.stringify({
        pid: user.persona_id,
        uid: user.usuario_id,
        nombre: user.nombre,
        paterno: user.paterno,
        materno: user.materno,
        username: user.username,
        roles: user.roles,
      })
    );
  },
  getUser() {
    return sessionStorage.getItem("tyuia")
      ? JSON.parse(sessionStorage.getItem("tyuia"))
      : null;
  },
  removeUser() {
    return sessionStorage.removeItem("tyuia");
  },
  getHeader() {
    return {
      headers: {
        Accept: "application/json",
        Authorization: this.getToken(),
      },
    };
  },
  rolePreuniversitario() {
    // 49 Universidad Tecnico Preuniversitario Nacional
    // 52 Universidad Responsable Preuniversitario
    let rol_id = 0;
    if (this.getUser()) {
      rol_id = 48; //52;
    }
    return rol_id;
  },
  getEstado() {
    return [
      { id: true, descripcion: "activo" },
      { id: false, descripcion: "inactivo" },
    ];
  },
};
