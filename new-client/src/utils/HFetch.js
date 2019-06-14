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

  hfetch(resource, init = {}, proxy = true, mapserviceCall = true) {
    console.log("appConfig inside hfetch(): ", this.appConfig);

    let initDefaults = {
      credentials: "same-origin"
    };

    proxy =
      typeof proxy === "string" || proxy instanceof String
        ? proxy
        : proxy === true
        ? this.appConfig.proxy
        : "";
    let mapservice =
      mapserviceCall === true ? this.appConfig.mapserviceBase : "";

    init = deepMerge(initDefaults, init);

    /**
     * Debug
     */
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
