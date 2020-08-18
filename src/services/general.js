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
  setToken() {
    return sessionStorage.setItem("token");
  },
  getToken() {
    return "Bearer " + sessionStorage.getItem("token");
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
