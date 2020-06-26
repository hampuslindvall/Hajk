import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";
import { Router } from "backbone";
import ApplicationView from "./views/application.jsx";
import ApplicationModel from "./models/application.js";

import "./index.css";

(function() {
  function create_routes(routes, application_model) {
    var route_settings = {
      routes: {},
    };
    routes.forEach((route) => {
      if (route.default) {
        route_settings.routes[""] = route.name;
      }
      route_settings.routes["!/" + route.name] = route.name;
      route_settings[route.name] = () => {
        application_model.set("content", route.name);
      };
    });
    return route_settings;
  }

  function load(config) {
    var application_model = new ApplicationModel();

    var application_element = React.createElement(ApplicationView, {
      model: application_model,
      tabs: config.router,
      config: config,
    });

    var router = Router.extend(create_routes(config.router, application_model));

    new router();
    Backbone.history.start();
    ReactDOM.render(application_element, document.getElementById("root"));
  }

  fetch("config.json").then((response) => {
    response.json().then((config) => {
      try {
        load(config);
      } catch (error) {
        console.log("error", error);
      }
    });
  });
})();
