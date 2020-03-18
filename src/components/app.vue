<template>
  <f7-app :params="f7params">
    <!-- Punto de entrada principal de rutas -->
    <f7-view main class="safe-areas" url="/"></f7-view>
  </f7-app>
</template>
<script>
import { Device } from "../js/framework7-custom.js";
import cordovaApp from "../js/cordova-app.js";
import routes from "../js/routes.js";

export default {
  data() {
    return {
      // Framework7 Parameters
      f7params: {
        id: "com.aws.meetup", // App bundle ID
        name: "AWS Test", // App name
        theme: "ios", // Opciones: md , ios, auto Automatic theme detection
        // App routes
        routes: routes,
        // Input settings
        input: {
          scrollIntoViewOnFocus: Device.cordova && !Device.electron,
          scrollIntoViewCentered: Device.cordova && !Device.electron
        },
        // Cordova Statusbar settings
        // codigos para que siempre se vea la barra de estado de android
        statusbar: {
          iosOverlaysWebView: true,
          androidOverlaysWebView: true,
          androidTextColor: "white",
          iosTextColor: "white",
          enabled: true
        }
      }
    };
  },
  methods: {},
  mounted() {
    this.$f7ready(f7 => {
      // Init cordova APIs (see cordova-app.js)
      if (Device.cordova) {
        cordovaApp.init(f7);
      }
      // Call F7 APIs here
    });
  }
};
</script>
