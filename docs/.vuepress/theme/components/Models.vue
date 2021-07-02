<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1 id="complex-types">
        <a href="#complex-types" class="header-anchor">#</a> Complex Types
      </h1>
      <p>
        Not all data can be easily described with simple data structures. This
        page lists all the complex data structures that our Settle API is using.
      </p>
      <div class="md-api_reference_FiraCode">
        <section v-for="(type, index) in types" :key="index" :id="type.title">
          <h2>
            <router-link :to="'#' + type.title" class="header-anchor"
              >#</router-link
            >
            <!-- <a :href="'#' + type.title" class="header-anchor">#</a>  -->
            {{ type.title }}
          </h2>
          <p v-if="type.properties || type.description">
            {{ type.description }}
          </p>
          <div v-if="type.properties" class="modelEntry">
            <div
              v-for="(property, name) in type.properties"
              :key="name"
              class="md-api_reference_FiraCode"
            >
              <h3 :id="type.title + '_' + name">
                <router-link
                  :to="'#' + type.title + '_' + name"
                  class="header-anchor"
                  >#</router-link
                >
                <!-- <a :href="'#' + type.title + '?typename=' + name" class="header-anchor">#</a> -->
                {{ name }}
              </h3>
              <!-- {{ property }} -->
              <ul>
                <li v-if="property.$ref">
                  Type:
                  <code>
                    <router-link :to="'#' + property.$ref">{{
                      property.$ref
                    }}</router-link>
                    <!-- <a :href="'#' + property.$ref">{{ property.$ref }}</a> -->
                  </code>
                </li>
                <li v-if="property.type">
                  Type: <code>{{ property.type }}</code>
                </li>
                <li v-if="property.required">
                  Required:
                  <code
                    ><span class="required">{{ property.required }}</span></code
                  >
                </li>
                <li v-if="property.default">
                  Default: <code>{{ property.default }}</code>
                </li>
                <div v-if="property.type === 'integer'">
                  <div
                    v-if="
                      property.minimum &&
                      property.maximum &&
                      property.minimum === property.maximum
                    "
                  >
                    <li>
                      Value: <small>=== {{ property.minimum }}</small>
                    </li>
                  </div>
                  <div v-else>
                    <li v-if="property.minimum">
                      Minimum: <small>&#8805; {{ property.minimum }}</small>
                    </li>
                    <li v-if="property.maximum">
                      Maximum: <small>&#8804; {{ property.maximum }}</small>
                    </li>
                  </div>
                </div>
                <div v-else>
                  <div
                    v-if="
                      property.minLength &&
                      property.maxLength &&
                      property.minLength === property.maxLength
                    "
                  >
                    <li>
                      Length: <small>=== {{ property.minLength }}</small>
                    </li>
                  </div>
                  <div v-else>
                    <li v-if="property.minLength">
                      MinLength: <small>&#8805; {{ property.minLength }}</small>
                    </li>
                    <li v-if="property.maxLength">
                      MaxLength: <small>&#8804; {{ property.maxLength }}</small>
                    </li>
                  </div>
                </div>
                <li v-if="property.pattern">
                  RegExp: <small>{{ property.pattern }}</small>
                </li>
                <li v-if="property.enum">
                  Enum: <small>{{ property.enum }}</small>
                </li>
              </ul>
              <p v-if="property.description">{{ property.description }}</p>
            </div>
          </div>
          <div v-if="!type.description && !type.properties">
            <p>
              No info available for <strong>{{ type.title }}</strong> at of this
              moment. Please
              <a
                href="https://settle.eu/contact/"
                target="_blank"
                rel="noopener noreferrer"
                >contact us<span
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                    x="0px"
                    y="0px"
                    viewBox="0 0 100 100"
                    width="15"
                    height="15"
                    class="icon outbound"
                  >
                    <path
                      fill="currentColor"
                      d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
                    ></path>
                    <polygon
                      fill="currentColor"
                      points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
                    ></polygon>
                  </svg>
                  <span class="sr-only">(opens new window)</span></span
                ></a
              >
              for more information.
            </p>
          </div>
        </section>
      </div>
    </div>
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from "@theme/components/PageEdit.vue";
import PageNav from "@theme/components/PageNav.vue";

const axios = require("axios");
const _ = require("lodash");

const yaml = require("js-yaml");

export default {
  components: { PageEdit, PageNav },
  props: ["sidebarItems"],
  data() {
    return {
      types: [],
    };
  },
  async beforeMount() {
    const data = this.$data;
    const site = this.$site;
    const page = this.$page;

    // console.log(this.$site.pages[0].models);

    if (page.models) {
      data.types = page.models;
    } else if (site.pages[0].models) {
      data.types = site.pages[0].models;
    } else {
      console.warn("Neither page.models or site.pages[0].models found...");
    }

    // console.log(data.types);

    // console.log(this.$themeConfig.sidebar);

    let sidebars = this.$themeConfig.sidebar;

    // console.log(sidebars);
    // console.log(window.location.origin);

    _.filter(sidebars, function (a, b) {
      // console.log(b);
      if (b === "/api/reference/rest/") {
        // console.log(a);
        _.filter(a, function (c, d) {
          // console.log(c.title);
          if (c.title === "REST Models") {
            // console.log(c);
            // c.children = site.pages[0].models;
            _.filter(data.types, function (e, f) {
              // console.log(e.title);

              // let uri =
              //   window.location.origin +
              //   "/api/reference/rest/v1/models/#" +
              //   e.title;

              let uri =
                window.location.origin +
                "/api/reference/rest/v1/models/#" +
                e.title;

              // console.log(uri);
              c.children.push([uri, e.title]);
            });
          }
        });
        // console.log(sidebars);
      }
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
