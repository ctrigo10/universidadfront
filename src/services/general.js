export default {
  getServe() {
    if (process.env.NODE_ENV === "production") {
      return "http://100.0.100.200:4000/";
    } else {
      return "http://localhost:3000/";
    }
  },
  getBase() {
    return this.getServe() + "prefa/";
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
};
