<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen>
    <!-- //! titulo centrado  del componente login-screen -->
    <f7-login-screen-title>AWS Test</f7-login-screen-title>
    <!-- //! Formulario -->
    <f7-list form>
      <!-- //! Input Usuario -->
      <f7-list-input
        label="Usuario"
        type="text"
        placeholder="Su Usuario"
        :value="user.username"
        @input="user.username = $event.target.value"
      ></f7-list-input>
      <!-- //! Input Contraseña -->
      <!-- //! @input Evento obligatorio para que actualice el valor de la variable -->
      <f7-list-input
        label="Contraseña"
        type="password"
        placeholder="Su Contraseña"
        :value="user.password"
        @input="user.password = $event.target.value"
      ></f7-list-input>
    </f7-list>
    <f7-list>
      <!-- //! Boton de enviar -->
      <f7-list-button @click="signIn">Entrar</f7-list-button>
    </f7-list>
    <!-- //! Componente footer -->
    <f7-row tag="p" class="pies1">
      <f7-col tag="span">
        <f7-button large raised small class="boton-peq" href="/register/"
          >Regístrate</f7-button
        >
      </f7-col>
    </f7-row>
    <f7-row tag="p" class="pies">
      <f7-col tag="span">
        <f7-button large raised small class="boton-peq" @click="PerdidadeClave"
          >¿Olvidaste tu Contraseña?</f7-button
        >
      </f7-col>
    </f7-row>
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
        password: ""
      }
    };
  },
  mounted() {
    Auth.configure(awssetting);
  },
  methods: {
    signIn() {
      const self = this;
      if (!self.user.username) {
        self.$f7.dialog.alert("No hay datos en el usuario", "Error");
        return;
      }
      if (!self.user.password) {
        self.$f7.dialog.alert("No hay datos en la contraseña", "Error");
        return;
      }
      self.$f7.preloader.show();

      Auth.signIn({
        username: self.user.username.trim().toLowerCase(),
        password: self.user.password.trim().toLowerCase()
      })
        .then(user => {
          store.commit("setUser", user);
          self.$f7.preloader.hide();
          self.$f7router.navigate("/home/", {
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

          if (err.code === "NotAuthorizedException") {
            if (err.message === "User is disabled.") {
              self.$f7.dialog.alert("El usuario esta deshabilitado", "Error");
              return;
            }
            self.$f7.dialog.alert("Usuario / Contraseña Invalidos", "Error");
          }
          if (err.code === "UserNotConfirmedException") {
            self.$f7.dialog.prompt(
              "Introduzca el codigo",
              "Verificar Usuario",
              code => {
                Auth.confirmSignUp(
                  self.user.username.trim().toLowerCase(),
                  code,
                  {
                    forceAliasCreation: true
                  }
                )
                  .then(data => {
                    self.$f7.preloader.hide();
                    self.$f7.dialog.alert("Usuario Confirmado");
                    self.$f7router.navigate("/", {
                      transition: "f7-flip",
                      props: {},
                      clearPreviousHistory: true,
                      animate: true,
                      history: false,
                      ignoreCache: false
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    if (err.code === "CodeMismatchException") {
                      return self.$f7.dialog.alert(
                        "Codigo de Verificación Invalido"
                      );
                    }
                    if (err.code === "ExpiredCodeException") {
                      return self.$f7.dialog.confirm(
                        "Este codigo ya expiró, Desea solicitar un nuevo codigo?",
                        callbackOk => {
                          self.reSend(self.user.username.trim().toLowerCase());
                        },
                        callbackCancel => {}
                      );
                    }
                    if (err.code === "AliasExistsException") {
                      return self.$f7.dialog.alert("Este correo ya existe..");
                    }
                    if (err.code === "InternalErrorException") {
                      return self.$f7.dialog.alert(
                        "Error interno, Intente nuevamente"
                      );
                    }
                  });
              },
              cancel => {
                console.log("valor de cancel ", cancel);
              }
            );
          }
          if (err.code === "UserNotFoundException") {
            self.$f7.dialog.alert("El usuario no EXISTE", "Error");
          }
        });
    },
    reSend(arg) {
      Auth.resendSignUp(arg)
        .then(() => {
          return self.$f7.dialog.alert("Se envio un nuevo codigo con exito");
        })
        .catch(e => {
          console.log(e);
          return self.$f7.dialog.alert(
            "Hubo un error al momento de solicitar el nuevo codigo"
          );
        });
    },
    PerdidadeClave() {
      const self = this;
    }
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed&display=swap");
:root {
  --f7-label-text-color: #f00d0d;
  --f7-button-small-text-transform: none;
  --f7-button-small-font-size: 16px;
  --f7-button-small-font-weight: none;
  --f7-dialog-button-text-color: #000;
}
.pies {
  position: fixed;
  height: 30px;
  bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width: 100%;
}
.pies1 {
  position: fixed;
  height: 30px;
  bottom: 50px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width: 100%;
}
.boton-peq {
  width: 80%;
  margin: 0px auto;
  font-family: "Roboto Condensed", sans-serif !important;
}
</style>
