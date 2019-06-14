/**
 *
 * @param {String,Object} resource
 * @param {Object} init
 * @param {Boolean,String} proxy
 *
 * Simple use case  – defaults for @param init and @param proxy (see code for defaults):
 *    this.app.hfetch("someUrl").then();
 * More advanced use case – custom @param init that gets added to existing defaults.
 * Also proxy is disabled with the third parameter.
 *    this.app.hfetch("blabla", { method: "POST" }, false).then();
 * Another example, default @param init but a custom proxy provided as String
 *    this.app.hfetch("blabla", { }, "https://myproxy.domain.com").then();
 */

import { deepMerge } from "./DeepMerge";

export default class HFetch {
  constructor(appConfig) {
    this.appConfig = appConfig;
    console.log("INITIALIZING HFETCH");
  }

  hfetch(resource, options = {}) {
    // We must deepMerge options, otherwise a shallow merge with only
    // one of the options specified would null other keys in the object.
    const defaultOpts = {
      init: { credentials: "same-origin" }, // Some proxies require this
      proxy: true, // "true" here means we will use proxy IF there's one defined in appConfig.json
      mapservice: true // "true" here means that the resource will be prefixed with the value of mapserviceBase (from appConfig.json)
    };
    const opts = deepMerge(defaultOpts, options);

    if (this.appConfig.debug === true) {
      console.log("hfetch merged opts:", opts);
    }

    const proxy =
      typeof opts.proxy === "string" || opts.proxy instanceof String
        ? opts.proxy
        : opts.proxy === true
        ? this.appConfig.proxy
        : "";
    const mapservice =
      opts.mapservice === true ? this.appConfig.mapserviceBase : "";

    // Note: "init" is called so because it's the official name of fetch()'s second parameter
    let init = opts.init;

    if (this.appConfig.debug === true) {
      console.log("hfetch called to resource:", resource);
      console.log("hfetch proxy:", proxy);
      console.log("hfetch init values:");
      console.table(init);
      console.table(
        "OK, hfetch is calling the resource above via specified proxy (if any) and with specified init parameters."
      );
    }

    return fetch(proxy + mapservice + resource, init);
  }
}
