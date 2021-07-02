<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1 id="settle-apis">
        <a href="#settle-apis" class="header-anchor">#</a> Settle APIs
      </h1>
      <!-- <p>
        The <strong>Settle APIs</strong> enables merchants to interact with Settle, registering
        POS', create shortlinks for QR scans, send payment requests, submit permission requests for
        end user info, and much more.
      </p> -->

      <Content />

      <!-- <div class="md-api_reference_FiraCode">
        <div class="md-api_reference_method_heading">api.settle.eu</div>
      </div> -->

      <h2 id="discovery-document">
        <a href="#discovery-document" class="header-anchor">#</a> Discovery
        Document
      </h2>
      <p>
        A <a href="/discovery/v1/reference/apis/">Discovery Document</a> is a
        machine-readable specification for describing and consuming REST APIs.
        It is used to build client libraries, IDE plugins, and other tools that
        interact with the Settle APIs. One service may provide multiple
        discovery documents. This service provides the following discovery
        document:
      </p>
      <ul>
        <li>
          <s
            ><span class="url"
              >https://api.settle.eu/$discovery/rest?version=v1</span
            ></s
          >
        </li>
      </ul>
      <h2 id="service-endpoints">
        <a href="#service-endpoints" class="header-anchor">#</a> Service
        Endpoints
      </h2>
      <p>
        A service endpoint is a base URL that specifies the network address of
        an API service. One service might have multiple service endpoints.
      </p>
      <div class="md-api_reference_FiraCode">
        <!-- <div class="md-api_reference_method_heading"> -->
        <ul>
          <li>
            <strong>Production:</strong>
            <span class="url">https://api.settle.eu</span>
          </li>
          <li>
            <strong>Sandbox:</strong>
            <span class="url">https://api.sandbox.settle.eu</span>
          </li>
        </ul>
        <!-- </div> -->
      </div>
      <h2 id="rest-resources">
        <a href="#rest-resources" class="header-anchor">#</a> REST Resources
      </h2>
      <p>
        The above services has the following endpoints (resources), and all
        methods below are relative to its parent method (service endpoint).
      </p>
      <div class="md-api_reference_FiraCode" v-if="!resource.internal">
        <!-- REST REsources -->

        <section v-for="(resource, index) in $data.resource" :key="index">
          <h3 :id="'v' + resource.version + '-' + resource.headerAnchor">
            <router-link
              :to="'#v' + resource.version + '-' + resource.headerAnchor"
              class="header-anchor"
              >#</router-link
            >
            <router-link :to="index"
              >v{{ resource.version }}.{{ index }}</router-link
            >
          </h3>
          <table class="table">
            <thead>
              <tr>
                <th style="text-align: left">Methods</th>
                <th></th>
              </tr>
            </thead>
            <tbody v-if="resource.methods">
              <tr
                v-for="(method, ind) in resource.methods"
                :key="ind"
                :id="
                  'v' +
                  resource.version +
                  '-' +
                  resource.headerAnchor +
                  '-' +
                  ind
                "
              >
                <td style="text-align: left">
                  <router-link :to="index + '/' + ind">{{ ind }}</router-link>
                </td>
                <td>
                  <span class="noLink">
                    <router-link :to="index + '/' + ind">
                      <span :class="['badge small', method.operation]">{{
                        method.operation
                      }}</span>
                      <span v-html="method.endpoint"></span>/
                    </router-link>
                  </span>
                  <p>{{ method.excerpt }}</p>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td>Error:</td>
                <td>No results</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>

    <PageEdit />
    <Footer />
    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from "@theme/components/PageEdit.vue";
import PageNav from "@theme/components/PageNav.vue";
import Footer from "@theme/components/Footer.vue";

const axios = require("axios");
const _ = require("lodash");

const yaml = require("js-yaml");

export default {
  components: { PageEdit, PageNav, Footer },
  props: ["sidebarItems"],
  data() {
    return {
      // methods: [],
      // resourceOverviewUrl: [],
      resource: {},
    };
  },
  async beforeMount() {
    console.clear();

    const site = this.$site;
    const pages = site.pages;
    const page = this.$page;
    const props = this.$props;
    const data = this.$data;

    // console.log(site.pages[0].reference);

    let reference;

    function logReference(ref) {
      console.log("reference: ", ref);
    }

    if (page.reference) {
      reference = page.reference;
      logReference(reference);
    } else if (site.pages[0].reference) {
      reference = site.pages[0].reference;
      logReference(reference);
    } else {
      console.warn(
        "Neither $page.reference or $site.pages[0].reference found..."
      );
    }

    let apis = [];
    const methods = ["post", "get", "put", "delete"];
    const operations = ["create", "list", "update", "get", "lookup", "delete"];
    let resourceEntryMethods = [];
    let resourceData = data.resource;

    if (reference !== undefined) {
      console.log("Good to go!");
      // console.log(reference);

      _.filter(reference, function (api, name) {
        // console.log(api.info);
        apis.push(name);
      });

      // console.log(apis);

      let apiPath = [];

      _.filter(apis, function (apiName, val) {
        // console.log(reference[apiName].paths);
        apiPath.push(reference[apiName].paths);
      });

      // console.log("apiPath: ", apiPath);

      _.filter(apiPath, function (endpoints) {
        // console.log("endpoints: ", endpoints);

        _.filter(endpoints, function (ep, pe) {
          // console.log(pe);
          // console.log("ep[post]: ", ep["post"]);

          methods.forEach((method) => {
            // console.log("method: ", method);
            // console.log("ep[" + method + "]: ", ep[method]);

            if (ep[method] !== undefined) {
              let thisMetod = ep[method];
              // console.log("ep[" + method + "]: ", thisMetod);
              let operationId = thisMetod.operationId.split(/\.(?=[^\.]+$)/);
              let resourceName = operationId[0];
              let operationName = operationId[1];

              // console.log("resourceName: ", resourceName);

              operations.forEach((operation) => {
                if (operation === operationName) {
                  // console.log("ep[" + method + "]: ", thisMetod);
                  // console.log("operationName: ", operationName);

                  // console.log("operation: ", operation);

                  let resourceEntry = {
                    name: resourceName,
                    methods: {},
                    deprecated: false,
                    internal: false,
                  };

                  _.filter(reference, function (api, name) {
                    // console.log(name);
                    if (name === thisMetod.operationId.split(".")[0]) {
                      // console.log(api.info.version);
                      // thisMetod.version = api.info.version;
                      resourceEntry.version = api.info.version.split(".")[0];

                      let headerAnchor = resourceName.replaceAll(".", "-");
                      // console.log("headerAnchor: ", headerAnchor);
                      resourceEntry.headerAnchor = headerAnchor;
                    }
                  });

                  if (!resourceData) {
                    resourceData = {};
                  } else {
                    resourceData[resourceName] = resourceEntry;

                    // console.log(
                    //   "resourceData[resourceName].methods: ",
                    //   resourceData[resourceName].methods
                    // );
                    // resourceData[resourceName].methods['hey'];
                  }
                }
              });

              if (operationName !== undefined) {
                // console.log("operationId: ", operationName);

                _.filter(resourceData, function (data) {
                  // console.log("data: ", data);
                  // console.log("method: ", method);
                  // console.log("operationName: ", operationName);

                  if (
                    thisMetod.operationId ===
                    data.name + "." + operationName
                  ) {
                    // console.log(
                    //   "data.name: ",
                    //   data.name + "." + operationName
                    // );
                    // console.log(resourceData[data.name]);

                    // _.filter(
                    //   resourceData[data.name].methods,
                    //   function (fry, leela) {
                    //     // console.log(leela);
                    //     // console.log(operationName);

                    //     if (leela === operationName) {
                    //       // console.log(resourceData[data.name].methods[leela]);
                    //       console.group(data.name);
                    //       console.log(
                    //         "data.name: ",
                    //         data.name + "." + operationName
                    //       );
                    //       console.log("method: ", leela);
                    //       console.groupEnd();

                    //       // console.log(thisMetod);

                    //       // resourceData[data.name].methods[leela] = thisMetod;
                    //     }
                    //   }
                    // );
                    _.filter(operations, function (fry, leela) {
                      // console.log(fry);
                      // console.log(operationName);

                      if (fry === operationName) {
                        // console.log(resourceData[data.name].methods[leela]);
                        // console.group(data.name);
                        // console.log(
                        //   "data.name: ",
                        //   data.name + "." + operationName
                        // );
                        // console.log("method: ", fry);
                        // console.groupEnd();

                        // thisMetod.method = operationName;
                        thisMetod.operation = method;
                        thisMetod.endpoint = pe;
                        thisMetod.api = thisMetod.operationId.split(".")[0];
                        // console.log('thisMetod: ', thisMetod.description);

                        let excerpt;

                        if (thisMetod.description) {
                          excerpt = thisMetod.description
                            .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
                            .split("|")[0];
                        }
                        // console.log(excerpt);
                        thisMetod.excerpt = excerpt;

                        // _.filter(reference, function (api, name) {
                        //   // console.log(name);
                        //   if (name === thisMetod.operationId.split(".")[0]) {
                        //     // console.log(api.info.version);
                        //     thisMetod.version = api.info.version;
                        //   }
                        // });

                        // console.log(pe);
                        // thisMetod.apiVersion = api.info.version

                        if (page.reference) {
                        } else if (site.pages[0].reference) {
                        }

                        resourceEntryMethods.push(thisMetod);
                      }
                    });
                  }
                });
              }
            }
          });
        });
      });
    }
    // console.log("resourceEntryMethods: ", resourceEntryMethods);
    _.filter(resourceEntryMethods, function (bender, zoidberg) {
      // console.log(bender.operationId.split(/\.(?=[^\.]+$)/)[1]);

      _.filter(operations, function (boy, girl) {
        // console.log(boy);
        // console.log(operationName);

        let hmm = bender.operationId.split(/\.(?=[^\.]+$)/);

        if (boy === hmm[1]) {
          // console.log(hmm[0]);
          // console.log(boy);

          // resourceData[hmm[0]].methods.push(boy)
          resourceData[hmm[0]].methods[boy] = bender;
          console.log(
            "resourceData[hmm[0]].methods[boy]: ",
            resourceData[hmm[0]].methods[boy]
          );
          // console.log(resourceData[hmm[0]].methods[boy]);
          if (bender.deprecated) {
            console.log("deprecated: ", bender.deprecated);
            resourceData[hmm[0]].deprecated = true;
          }

          if (bender["x-internal"]) {
            console.log("x-internal: ", bender["x-internal"]);
            resourceData[hmm[0]].internal = true;
          }
        }
      });
    });
  },
};
</script>

<style lang="stylus">
@require '../styles/wrapper.styl';

.page
  padding-bottom: 2rem;
  display: block;
</style>
