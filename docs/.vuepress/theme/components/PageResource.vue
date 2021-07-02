<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h2>
        Method: <span class="FiraCode">{{ $frontmatter.operationId }}</span>
      </h2>

      <!-- <div class="md-api_reference_method_heading">
        {{ $frontmatter.operationId }}
      </div> -->
      <Content />

      <div v-if="$data.resourceExists === true">
        <h2 id="http-request">
          <router-link :to="'#http-request'" class="header-anchor"
            >#</router-link
          >
          HTTP Request
        </h2>
        <div class="md-api_reference_FiraCode">
          <div class="md-api_reference_request_heading">
            <p v-if="method.operation && method.path">
              <span :class="['badge', method.operation]">{{
                method.operation
              }}</span>
              {{ method.path }}
            </p>
          </div>
          <p>{{ method.excerpt }}</p>
          <h3 id="authorization-scopes">
            <router-link :to="'#authorization-scopes'" class="header-anchor"
              >#</router-link
            >
            Authorization Scopes
          </h3>
          <ul>
            <li>
              Required Auth Level:
              <router-link
                v-if="$frontmatter.authLevel === 'SECRET'"
                :to="'/api/guides/introduction/authentication/#authentication-using-secret'"
                >{{ $frontmatter.authLevel }}
              </router-link>
              <router-link
                v-if="$frontmatter.authLevel === 'KEY'"
                :to="'/api/guides/introduction/authentication/#authentication-using-key'"
                >{{ $frontmatter.authLevel }}
              </router-link>
            </li>
            <li>Authorized Roles: {{ $frontmatter.authRoles }}</li>
          </ul>
          <h3 id="base-uris" v-if="servers">
            <a href="#base-uris" class="header-anchor">#</a> Base URIs
          </h3>
          <div v-if="servers">
            <ul>
              <div v-for="(server, index) in servers" :key="index">
                <li v-if="server.description !== 'Mock'">
                  {{ server.description }}:
                  <span class="url">{{ server.url }}</span>
                </li>
              </div>
            </ul>
          </div>
          <div v-if="statusCodes.length">
            <h3 id="status-codes">
              <a href="#status-codes" class="header-anchor">#</a> Status Codes
            </h3>
            <ul>
              <li v-for="(code, index) in statusCodes" :key="index">
                <strong>{{ code.code }}</strong> -->
                <strong>{{ code.title }}</strong
                ><span v-if="code.description">, {{ code.description }}</span>
              </li>
            </ul>
          </div>
        </div>
        <section v-if="schemas.length">
          <h2 id="schema">
            <a href="#schema" class="header-anchor">#</a> Schema
          </h2>
          <div class="md-api_reference_FiraCode">
            <div v-for="(type, entry) in schemas" :key="entry">
              <h3 :id="type.name">
                <router-link :to="'#' + type.name" class="header-anchor"
                  >#</router-link
                >
                {{ type.name }}
              </h3>
              <ul>
                <li>
                  Type:
                  <!-- <code v-if="type.url && type.type">
                <router-link :to="type.url">{{ type.type }}</router-link>
              </code> -->
                  <code v-if="type.$ref">
                    <router-link
                      :to="'/api/reference/rest/v1/models/#' + type.$ref"
                      >{{ type.$ref }}</router-link
                    >
                  </code>
                  <code v-else>{{ type.type }}</code>
                </li>

                <li v-if="type.required">
                  Required:
                  <code class="required">{{ type.required }}</code>
                </li>
                <li v-if="type.enum">
                  Enum: <code>{{ type.enum }}</code>
                </li>
                <li v-if="type.default">
                  Default: <code>{{ type.default }}</code>
                </li>
                <li
                  v-if="
                    type.minLength &&
                    type.maxLength &&
                    type.minLength === type.maxLength
                  "
                >
                  Length: <code>{{ type.minLength }}</code>
                </li>
                <li v-else-if="type.minLength">
                  Length: <code>&#8805; {{ type.minLength }}</code>
                </li>
                <li v-else-if="type.maxLength">
                  Length: <code>&#8804; {{ type.maxLength }}</code>
                </li>
                <li v-if="type.minimum && type.type === 'integer'">
                  Value: <code>&#8805; {{ type.minimum }}</code>
                </li>
                <li v-if="type.maximum && type.type === 'integer'">
                  Value: <code>&#8804; {{ type.maximum }}</code>
                </li>
                <li v-if="type.pattern">
                  RegExp: <code>{{ type.pattern }}</code>
                </li>
              </ul>
              <p v-if="type.description">{{ type.description }}</p>
            </div>
          </div>
        </section>

        <br />
        <!-- <h2 id="code-snippets">
          <a href="#code-snippets" class="header-anchor">#</a> Code Snippets
        </h2> -->
        <Content slot-key="example" />

        <!-- <h2 id="request-body">
        <a href="#request-body" class="header-anchor">#</a> Request Body
      </h2>
      <div class="custom-block warning">
        <p class="custom-block-title">NOTE</p>
        <p>The request body can not be empty.</p>
      </div>

      <h2 id="response-body">
        <a href="#response-body" class="header-anchor">#</a> Response Body
      </h2>
      <p>
        If successful, the response body contains data with the following
        structure:
      </p> -->
      </div>
      <div v-else>
        <div class="warning custom-block">
          <p class="custom-block-title">WARNING</p>
          <p>
            No reference found for method
            <strong>{{ $frontmatter.operationId }}</strong
            >.
          </p>
        </div>
      </div>
    </div>
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />
    <Footer />
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

let site;
let page;
let frontmatter;
let props;
let data;

let methods = ["post", "get", "put", "delete"];

let reference;
let unsortedShit = [];

let getResource;

export default {
  components: { PageEdit, PageNav, Footer },
  props: ["sidebarItems"],
  data() {
    return {
      servers: [],
      statusCodes: [],
      method: null,
      resourceExists: false,
      schemas: [],
      resourceOverviewUrl: [],
    };
  },
  async beforeMount() {
    // console.clear();

    console.log("beforeMount");

    site = this.$site;
    page = this.$page;
    frontmatter = this.$page.frontmatter;
    props = this.$props;
    data = this.$data;

    unsortedShit = [];

    this.$page.frontmatter.title = "Method: " + this.$page.frontmatter.title;

    //   console.log(this.$props);

    getResource = () => {
      // const api = function () {
      //   let schema = page.frontmatter.operationId.split(".")[0];
      //   // console.log("schema: ", schema);
      //   if (schema === "merchant") {
      //     return "merchant";
      //   } else if (schema === "oauth2") {
      //     return "oauth2";
      //   } else if (schema === "users") {
      //     return "users";
      //   }
      // };

      // console.log("this.$page: ", this.$page.reference);
      // console.log("this.$site: ", this.$site.pages[0].reference);

      if (page.reference) {
        reference = page.reference;
        console.log("reference: ", reference);
      } else if (site.pages[0].reference) {
        reference = site.pages[0].reference;
        console.log("reference: ", reference);
      } else {
        console.warn(
          "Neither $page.reference or $site.pages[0].reference found..."
        );
      }

      if (page.frontmatter.api !== undefined) {
        _.filter(reference, function (bart, lisa) {
          // console.log(lisa);
          // console.log(page.frontmatter.api);
          if (lisa === page.frontmatter.api) {
            // console.log(bart);
            data.servers = bart.servers;

            _.filter(bart.components.schemas, function (mat, gron) {
              console.log("gron: ", gron);
              // console.log(props.resource);
              // console.log(page.frontmatter.api + "." + gron);
              if (frontmatter.api + "." + gron === frontmatter.operationId) {
                // console.log(mat);

                _.filter(mat.properties, function (burns, bob) {
                  // console.log(bob, burns);
                  if (bob !== "null") {
                    // console.log(bob, burns);
                    burns.name = bob;
                    data.schemas.push(burns);
                  }
                });
              }
            });

            _.filter(bart.paths, function (homer, marge) {
              console.log("homer: ", homer);
              console.log("marge: ", marge);

              methods.forEach((meth) => {
                if (homer[meth]) {
                  console.log("found: ", homer[meth]);

                  if (homer[meth].operationId === frontmatter.operationId) {
                    console.log("Operation ID matches");
                    data.resourceExists = true;

                    // console.log("found: ", meth);

                    let excerpt = homer[meth].description
                      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
                      .split("|");
                    // console.log("description: ", excerpt[0]);

                    // console.log('frontmatter.operation: ', frontmatter.operation);

                    if (frontmatter.operation === meth) {
                      // console.log(frontmatter.operation + ' === ' + meth);
                      data.method = {
                        operation: meth,
                        path: marge + "/",
                        excerpt: excerpt[0],
                      };
                      unsortedShit.push(homer[meth]);
                    }
                  }
                }
              });
            });
          }
        });

        let uniqSchemas;

        // console.log("unsortedShit: ", unsortedShit);

        if (unsortedShit.length > 0) {
          uniqSchemas = _.uniq(unsortedShit);
          // console.log("uniqSchemas", uniqSchemas);
        }

        if (uniqSchemas !== undefined) {
          _.filter(uniqSchemas, function (mon, key) {
            // console.log(mon);
            if (mon.operationId === frontmatter.operationId) {
              // console.log(mon);
              _.filter(mon.responses, function (apu, smithers) {
                let title;
                let description;

                // console.log("apu", apu.$ref);
                if (apu.$ref) {
                  console.log("$ref", apu.$ref);
                  let currentResponseRef = apu.$ref.split(
                    "#/components/responses/"
                  )[1];
                  console.log("currentResponseRef: ", currentResponseRef);
                  // _.filter(reference, function (bart, lisa){})
                  let response =
                    reference[page.frontmatter.api].components.responses[
                      currentResponseRef
                    ];
                  console.log("response: ", response);
                  title = response.description;
                  if (title.includes(",")) {
                    title = title.split(",")[0];
                    description = title.split(",")[1];
                    // console.log("code", title + ":" + description);
                  } else {
                    title = title;
                  }
                } else {
                  console.log("apu", apu);
                  title = apu.description;
                  if (title.includes(",")) {
                    title = apu.description.split(",")[0];
                    description = apu.description.split(",")[1];
                    // console.log("code", title + ":" + description);
                  } else {
                    title = title;
                  }
                }

                let code = {
                  code: smithers,
                  title: title,
                  description: description,
                };

                data.statusCodes.push(code);
              });
              //
            }
          });
        }
      } else {
        console.warn(
          "No frontmatter.api assigned to the resource ",
          page.frontmatter,
          "."
        );
      }
    };

    getResource();
  },
  async mounted() {
    // console.log("mounted");
    // site = this.$site;
    // page = this.$page;
    // frontmatter = this.$page.frontmatter;
    // props = this.$props;
    // data = this.$data;
    // unsortedShit = [];
    // data.servers = [];
    // data.statusCodes = [];
    // data.method = null;
    // data.schemas = [];
    // data.resourceOverviewUrl = [];
    // getResource();
  },
  async beforeUpdate() {
    console.log("beforeUpdate");

    site = this.$site;
    page = this.$page;
    frontmatter = this.$page.frontmatter;
    props = this.$props;
    data = this.$data;

    unsortedShit = [];

    data.servers = [];
    data.statusCodes = [];
    data.method = null;
    data.resourceExists = false;
    data.schemas = [];
    data.resourceOverviewUrl = [];

    getResource();
  },
};
</script>

<style lang="stylus">
@require '../styles/wrapper.styl';

.page
  padding-bottom: 2rem;
  display: block;
</style>
