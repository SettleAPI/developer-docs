<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content rest-resource-summary">
      <h2 id="rest-resource">
        <router-link :to="'#rest-resource'" class="header-anchor"
          >#</router-link
        >
        REST Resource
      </h2>
      <div class="md-api_reference_FiraCode">
        <h3>{{ $frontmatter.schema }}</h3>
        <p></p>
      </div>
      <h3 id="resource">
        <router-link :to="'#resource'" class="header-anchor">#</router-link>
        Resource
      </h3>
      <div v-if="$frontmatter.resourceDesc === true">
        <Content slot-key="resource" :hasDescription="true" />
      </div>
      <div v-else>
        <p>There is no persistent data associated with this resource.</p>
      </div>

      <!-- <Content /> -->
      <h2 id="http-request">
        <router-link :to="'#http-request'" class="header-anchor">#</router-link>
        HTTP Requests
      </h2>
      <table class="table" v-if="$data.methods.length >= 1">
        <thead>
          <tr>
            <th style="text-align: left">Methods</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(method, index) in $data.methods" :key="index">
            <td style="text-align: left">
              <router-link
                :to="
                  '/api/reference/rest/v1/' +
                  $frontmatter.schema +
                  '/' +
                  method.method
                "
                >{{ method.method }}</router-link
              >
            </td>
            <td>
              {{ method.excerpt }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="warning custom-block">
        <p class="custom-block-title">WARNING</p>
        <p>
          No Methods found for <strong>{{ $frontmatter.schema }}</strong
          >.
        </p>
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

const _ = require("lodash");

const yaml = require("js-yaml");

// console.clear();

let getMethods;

let site;
let page;
let frontmatter;
let props;
let data;

const operations = ["post", "get", "put", "delete"];

let reference;

function log(msg, ref) {
  console.log(msg, ": ", ref);
}

export default {
  components: { PageEdit, PageNav, Footer },
  props: ["sidebarItems"],
  data() {
    return {
      methods: [],
    };
  },
  async extendPageData($page) {
    $page.size = await getAsyncData();
  },
  async beforeMount() {
    site = this.$site;
    page = this.$page;
    frontmatter = this.$frontmatter;
    props = this.$props;
    data = this.$data;

    data.methods = [];

    getMethods = () => {
      console.clear();

      if (page.reference) {
        reference = page.reference;
        // log("reference", reference);
      } else if (site.pages[0].reference) {
        reference = site.pages[0].reference;
        // log("reference", reference);
      } else {
        console.warn(
          "Neither $page.reference or $site.pages[0].reference found..."
        );
      }

      frontmatter.title = "REST Resource: " + frontmatter.title;

      // console.log(frontmatter.api);

      _.filter(reference, function (api, name) {
        // console.log(api.info);

        if (frontmatter.api === name) {
          // log("reference", reference[name]);
          // log("paths", reference[name].paths);

          _.filter(reference[name].paths, function (a, b) {
            // log("a", b);

            _.filter(a, function (c, d) {
              // log("d", d);
              operations.forEach((operation) => {
                if (d === operation) {
                  // log("c", c);

                  let schema = c.operationId.split(/\.(?=[^\.]+$)/)[0];
                  // log("schema", schema);
                  // log("frontmatter.schema", frontmatter.schema);
                  if (schema === frontmatter.schema) {
                    // log("schema", schema);

                    let method = c.operationId.split(/\.(?=[^\.]+$)/)[1];
                    c.method = method;
                    // log("method", method);

                    let excerpt = c.description
                      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
                      .split("|")[0];
                    // console.log(excerpt);

                    c.excerpt = excerpt;

                    // log("c", c);

                    data.methods.push(c);
                    // log("methods", methods);
                  }
                }
              });
            });
          });
        }
      });
    };
  },
  async mounted() {
    site = this.$site;
    page = this.$page;
    frontmatter = this.$frontmatter;
    props = this.$props;
    data = this.$data;

    data.methods = [];

    getMethods();
  },
  async beforeUpdate() {
    site = this.$site;
    page = this.$page;
    frontmatter = this.$frontmatter;
    props = this.$props;
    data = this.$data;

    data.methods = [];

    getMethods();
  },
};
</script>

<style lang="stylus">
@require '../styles/wrapper.styl';

.page
  padding-bottom: 2rem;
  display: block;
</style>
