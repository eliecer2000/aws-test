<template>
  <f7-page name="home">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false" large>
      <f7-nav-left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>AWS Test</f7-nav-title>
      <f7-nav-right>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="right"
        ></f7-link>
      </f7-nav-right>
      <f7-nav-title-large sliding>AWS Test</f7-nav-title-large>
    </f7-navbar>
    <!-- Toolbar-->
    <f7-toolbar bottom>
      <f7-link>Left Link</f7-link>
      <f7-link>Right Link</f7-link>
    </f7-toolbar>
    <!-- Page content-->
    <f7-block strong>
      <p>
        This is an example of split view application layout, commonly used on
        tablets. The main approach of such kind of layout is that you can see
        different views at the same time.
      </p>

      <p>
        Each view may have different layout, different navbar type (dynamic,
        fixed or static) or without navbar.
      </p>

      <p>
        The fun thing is that you can easily control one view from another
        without any line of JavaScript just using "data-view" attribute on
        links.
      </p>
    </f7-block>

    <f7-block-title>Navigation</f7-block-title>
    <f7-list>
      <f7-list-item link="/about/" title="About"></f7-list-item>
      <f7-list-item link="/form/" title="Form"></f7-list-item>
      <f7-list-item link="/tabla/" title="Datos"></f7-list-item>
    </f7-list>

    <f7-block-title>Panels</f7-block-title>
    <f7-block strong>
      <f7-row>
        <f7-col width="50">
          <f7-button fill raised panel-open="left">Left Panel</f7-button>
        </f7-col>
        <f7-col width="50">
          <f7-button fill raised panel-open="right">Right Panel</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>

    <f7-list>
      <f7-list-item
        title="Dynamic (Component) Route"
        link="/dynamic-route/blog/45/post/125/?foo=bar#about"
      ></f7-list-item>
      <f7-list-item
        title="Default Route (404)"
        link="/load-something-that-doesnt-exist/"
      ></f7-list-item>
      <f7-list-item
        title="Request Data & Load"
        link="/request-and-load/user/123456/"
      ></f7-list-item>
    </f7-list>
    <f7-block-title>Sesión</f7-block-title>
    <f7-block strong>
      <f7-row>
        <f7-col>
          <f7-button fill @click="signOut" raised>Cierre de Sesión</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>

    <!-- Left resizable Panel with Reveal effect -->
    <f7-panel left reveal resizable>
      <f7-view>
        <f7-page>
          <f7-block>Left panel content</f7-block>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Right resizable Panel with Cover effect and dark layout theme -->
    <f7-panel right resizable theme-dark>
      <f7-view>
        <f7-page>
          <f7-block>Right panel content</f7-block>
        </f7-page>
      </f7-view>
    </f7-panel>
  </f7-page>
</template>
<script>
import store from "./../store/store";
import Auth from "@aws-amplify/auth";
import awssetting from "./../aws-exports";
export default {
  methods: {
    async signOut() {
      await Auth.signOut()
        .then(data => {
          store.commit("setUser", null);
          console.log(data);
        })
        .catch(err => console.log(err));

      // this.$router.push({ path: "/" });
    }
  }
};
</script>
