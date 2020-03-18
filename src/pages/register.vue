<template>
  <f7-page no-toolbar no-swipeback login-screen>
    <f7-navbar>
      <f7-nav-left back-link="Átras"> </f7-nav-left>
    </f7-navbar>
    <f7-list form>
      <f7-login-screen-title>Regístrate</f7-login-screen-title>
      <f7-list-input
        label="Usuario"
        type="text"
        clear-button
        required
        validate
        validate-on-blur
        error-message="Campo requerido.."
        placeholder="Su Usuario"
        :value="user.username"
        @input="user.username = $event.target.value"
      ></f7-list-input>
      <f7-list-input
        clear-button
        required
        validate
        validate-on-blur
        error-message="Campo requerido.."
        label="Contraseña"
        type="password"
        placeholder="Su Contraseña"
        :value="user.password"
        @input="user.password = $event.target.value"
      ></f7-list-input>
      <f7-list-input
        clear-button
        required
        validate
        validate-on-blur
        error-message="Campo requerido.."
        label="Confirmación Contraseña"
        type="password"
        placeholder="Su Confirmación"
        :value="user.password2"
        @input="user.password2 = $event.target.value"
      ></f7-list-input>
      <f7-list-input
        clear-button
        required
        validate
        validate-on-blur
        error-message="Campo requerido.."
        label="Correo Electronico"
        type="email"
        placeholder="Su Correo"
        :value="user.email"
        @input="user.email = $event.target.value"
      ></f7-list-input>
    </f7-list>
    <f7-list>
      <f7-list-button @click="signUp">Enviar</f7-list-button>
    </f7-list>
  </f7-page>
</template>
<script>
import store from "./../store/store";
import Auth from "@aws-amplify/auth";
import awssetting from "./../aws-exports";

export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
        password2: "",
        email: ""
      },
      guarda: false
    };
  },
  mounted() {},
  methods: {
    PerdidadeClave() {
      const self = this;
    },
    signUp() {
      const self = this;
      if (!self.user.username) {
        self.$f7.dialog.alert("No hay datos en el usuario", "Error");
        return;
      }
      if (!self.user.password) {
        self.$f7.dialog.alert("No hay datos en la contraseña", "Error");
        return;
      }
      if (!self.user.email) {
        self.$f7.dialog.alert("No hay datos en el correo electronico", "Error");
        return;
      }
      if (self.user.password !== self.user.password2) {
        self.$f7.dialog.alert("La contraseñas son diferentes..", "Error");
        return;
      }
      self.$f7.preloader.show();
      Auth.configure(awssetting);
      Auth.signUp({
        username: self.user.username.trim().toLowerCase(),
        password: self.user.password.trim(),
        attributes: {
          email: self.user.email.trim().toLowerCase()
        }
      })
        .then(user => {
          self.$f7.preloader.hide();
          self.$f7.dialog.alert("El usuario fue registrado con EXITO", "Aviso");
          self.$f7router.navigate("/", {
            transition: "f7-circle",
            props: {},
            clearPreviousHistory: true,
            animate: true,
            history: false,
            ignoreCache: false
          });
        })
        .catch(err => {
          console.log(err);
          self.$f7.preloader.hide();
          store.commit("setUser", null);
          if (err.code === "UsernameExistsException") {
            return self.$f7.dialog.alert("El usuario Ya EXISTE", "Error");
          }
          return self.$f7.dialog.alert("Debere reiniciar la app..", "Error");
        });
    }
  }
};
</script>
<style></style>
