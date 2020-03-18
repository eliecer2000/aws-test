import HomePage from "../pages/home.vue";
import RegisterPage from "../pages/register.vue";
import LoginPage from "../pages/login.vue";
import TablaPage from "../pages/tabla.vue";
import AboutPage from "../pages/about.vue";
import FormPage from "../pages/form.vue";
import FotoPage from "../pages/foto.vue";

import LeftPage1 from "../pages/left-page-1.vue";
import LeftPage2 from "../pages/left-page-2.vue";
import DynamicRoutePage from "../pages/dynamic-route.vue";
import RequestAndLoad from "../pages/request-and-load.vue";
import NotFoundPage from "../pages/404.vue";
import Auth from "@aws-amplify/auth";
import awssetting from "./../aws-exports";
Auth.configure(awssetting);

async function checkAuth(to, from, next, reject) {
  var self = this;
  try {
    const data = await Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    console.log("Usuario verificado ", data);
    await next();
  } catch (e) {
    console.log(e);
    reject();
    self.navigate("/");
  }
}

var routes = [
  {
    path: "/",
    name: "login",
    component: LoginPage
  },
  {
    path: "/register/",
    component: RegisterPage
  },
  {
    path: "/home/",
    component: HomePage,
    beforeEnter: checkAuth
  },
  {
    path: "/tabla/",
    component: TablaPage,
    beforeEnter: checkAuth
  },
  {
    path: "/foto/",
    component: FotoPage,
    beforeEnter: checkAuth
  },
  {
    path: "/about/",
    component: AboutPage,
    beforeEnter: checkAuth
  },
  {
    path: "/form/",
    component: FormPage,
    beforeEnter: checkAuth
  },

  {
    path: "/left-page-1/",
    component: LeftPage1,
    beforeEnter: checkAuth
  },
  {
    path: "/left-page-2/",
    component: LeftPage2,
    beforeEnter: checkAuth
  },
  {
    path: "/dynamic-route/blog/:blogId/post/:postId/",
    component: DynamicRoutePage,
    beforeEnter: checkAuth
  },
  {
    path: "/request-and-load/user/:userId/",
    async: function(routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function() {
        // We got user data from request
        var user = {
          firstName: "Vladimir",
          lastName: "Kharlampidi",
          about: "Hello, i am creator of Framework7! Hope you like it!",
          links: [
            {
              title: "Framework7 Website",
              url: "http://framework7.io"
            },
            {
              title: "Framework7 Forum",
              url: "http://forum.framework7.io"
            }
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad
          },
          {
            context: {
              user: user
            }
          }
        );
      }, 1000);
    },
    beforeEnter: checkAuth
  },
  {
    path: "(.*)",
    component: NotFoundPage
  }
];

export default routes;
