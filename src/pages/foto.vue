<template>
  <f7-page style="background-color: white;" class="back">
    <f7-block-title
      style="margin-top: 50px;margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    font-size: 22px;
    line-height: normal;"
      >Configurar Foto de Perfil</f7-block-title
    >
    <div style="width: 100%;">
      <croppa
        class="c1"
        v-model="croppa"
        :height="300"
        :width="300"
        placeholder=""
        placeholder-color="#000"
        :placeholder-font-size="16"
        canvas-color="transparent"
        :show-remove-button="false"
        remove-button-color="black"
        :show-loading="true"
        :loading-size="50"
        loading-color="#606060"
        :disable-click-to-choose="false"
        :disable-drag-and-drop="false"
        :disable-drag-to-move="false"
        :disable-scroll-to-zoom="false"
        :disable-pinch-to-zoom="false"
        :disable-rotation="true"
        :prevent-white-space="true"
        :zoom-speed="5"
        initial-size="natural"
        initial-position="center"
        :initial-image="initialImage"
      >
      </croppa>
    </div>
    <f7-col>
      <f7-button
        large
        raised
        fill
        style="width: 80%;margin: 20px auto;"
        @click="upload"
        >Enviar Foto</f7-button
      >
    </f7-col>
  </f7-page>
</template>
<script>
import Vue from "vue";
import Croppa from "vue-croppa";
import store from "./../store/store";
import uuid from "uuid/v4";

Vue.use(Croppa);
export default {
  components: {},
  computed: {
    user() {
      return store.state.auth.user;
    }
  },
  methods: {
    cordovacamera() {
      const self = this;
      if (!Vue.cordova.camera) {
        window.alert("Error en la camara");
        return;
      }
      Vue.cordova.camera.getPicture(
        imageURI => {
          self.initialImage = imageURI;
          self.croppa.refresh();
        },
        message => {
          window.alert("ERROR : " + message);
        },
        {
          quality: 80,
          destinationType: Vue.cordova.camera.DestinationType.FILE_URI, //DATA_URL: 0, NATIVE_URI: 2
          direction: Vue.cordova.camera.Direction.FRONT, // FRONT // BACK
          mediatype: Vue.cordova.camera.MediaType.PICTURE,
          encodingtype: Vue.cordova.camera.EncodingType.PNG,
          picturesourcetype: Vue.cordova.camera.PictureSourceType.CAMERA
        }
      );
    },
    pluginEnabled: function(pluginName) {
      return this.cordova.plugins.indexOf(pluginName) !== -1;
    },
    async upload() {
      const self = this;
      self.$f7.dialog.preloader("Enviando Información al Servidor");
      if (!this.croppa.hasImage()) {
        this.$f7.dialog.alert(
          "No se puede enviar la imagen, Intente mas tarde",
          "Error"
        );
        return;
      }
      this.croppa.generateBlob(async blob => {
        await Vue.prototype.$Amplify.Storage.configure({
          AWSS3: {
            bucket: "mibusitocolegialcd67ea4f33fa4565b809b37767d580b85727-dev", //Your bucket name;
            region: "us-east-1" //Specify the region your bucket was created in;
          }
        });
        await Vue.prototype.$Amplify.Storage.put(
          uuid() + ".png", // this.user.pool.clientId
          blob,
          {
            level: "public",
            contentType: "image/jpeg"
          }
        )
          .then(result => {
            self.$f7.dialog.close();
            self.$f7.dialog.alert("Datos Enviados", "Alerta");
            self.$f7router.navigate("/home", {
              transition: "f7-circle",
              props: {},
              clearPreviousHistory: true,
              animate: true,
              history: false,
              ignoreCache: false
            });
          })
          .catch(err => console.log(err));
      });
    }
  },
  data: function() {
    return {
      croppa: {},
      initialImage: "",
      cordova: Vue.cordova // this.plugins.cordova-plugin-camera()
    };
  },
  mounted() {
    this.cordovacamera();
    this.croppa.refresh();
    console.log(Vue.cordova);
  }
};
</script>
<style>
.croppa-container {
  background-color: lightblue;
  border: 1px solid grey;
  border-radius: 2px;
  font-size: 0 !important;
}
.croppa-container.c1 {
  width: 300px;
  height: 300px;
  margin: 50px auto;
  display: block !important;
}
.croppa-container:hover {
  opacity: 1;
  background-color: #8ac9ef;
}
</style>
