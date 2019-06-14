/**
 *
 * @param {String,Object} resource
 * @param {Object} options
 *
 * Requires only one parameter (@param resource). This will make a call to the MapService endpoint,
 * using the proxy (if specified in appConfig.json) and using default init params (init is fetch()'s second parameter).
 *
 * All other parameters are optional, but it's possible to disable use of proxy, disable the
 * assumption that we want to call a MapService endpoint, and also customize init params.
 *
 * Examples below.
 *
 * - Simple use case -
 * Use defaults for @param init and @param proxy (see code for defaults).
 *    this.app.HFetchInstance.hfetch("someUrl").then();
 *
 * - More advanced use case -
 * Use custom @param init that gets added to existing defaults.
 * Also do call to the specified resource, without assuming that it's an MapService endpoint.
 *    this.app.HFetchInstance.hfetch("https://mydomain.com/exampleURIWithAbsolultePath/notPartOfMapService", {
 *                                init: { method: "POST" },
 *                                mapservice: false
 *                              })
 *    .then();
 * - Custom proxy use case -
 * Use default @param init and call MapService, but use a custom proxy, provided as String.
 *    this.app.HFetchInstance.hfetch("/config/list", {
 *                                proxy: "https://myproxy.mydomain.com"
 *                              })
 *    .then()
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
