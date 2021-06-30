<template>
  <div>
    <vl-region>
      <vl-layout>
        <vl-button @click="navigate">
          Terug
        </vl-button>
      </vl-layout>
    </vl-region>
    <vl-region>
      <vl-layout>
        <vl-tabs>
          <vl-tab label="Pretty">
            <div v-if="Object.keys(resultObject).length > 0">
              <result-pretty :result-object="resultObject" />
            </div>
          </vl-tab>
          <vl-tab label="Raw">
            <result-raw :raw-result="rawResult" />
          </vl-tab>
        </vl-tabs>
      </vl-layout>
    </vl-region>
  </div>
</template>

<script>
import { RdfXmlParser } from "rdfxml-streaming-parser";
import store from "../store/store";
import ResultPrettyComponentVue from "../components/ResultPrettyComponent.vue";
import ResultRawComponentVue from "../components/ResultRawComponent.vue";

const Stream = require("stream");

export default {
  name: "ResultComponent",
  components: {
    "result-pretty": ResultPrettyComponentVue,
    "result-raw": ResultRawComponentVue
  },
  data() {
    return {
      resultObject: {},
      selectedFormat: "application/rdf+xml",
      rawResult: "",
      downloadLink: "",
      nameDownloadFile: ""
    };
  },
  mounted() {
    const result = store.getters.ShaclResult;
    if (result) {
      this.processResult(result);
    }
  },
  methods: {
    processResult(result) {
      const decoder = new TextDecoder("utf-8");
      const reader = result.body.getReader();
      reader.read().then(({ value, done }) => {
        this.parseResult(decoder.decode(value));
      });
    },
    parseResult(rdfXML) {
      this.rawResult = rdfXML;

      this.resultObject = {};
      let stream = new Stream();
      stream.readable = true;
      const myParser = new RdfXmlParser();

      stream
        .pipe(myParser)
        .on("data", this.processQuad)
        .on("error", console.error);

      stream.emit("data", rdfXML);
      stream.emit("end", "");
    },
    processQuad(quad) {
      const subject = quad.subject.value;
      const predicate = quad.predicate.value;
      const object = quad.object.value;

      // More data can be extracted if needed

      if (!this.resultObject[subject]) {
        this.resultObject[subject] = {};
      }

      if (predicate === "http://www.w3.org/ns/shacl#conforms") {
        this.resultObject[subject].conforms = object;
      }

      if (predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
        this.resultObject[subject].type = object;
      }

      if (predicate === "http://www.w3.org/ns/shacl#resultPath") {
        this.resultObject[subject].resultPath = object;
      }

      if (predicate === "http://www.w3.org/ns/shacl#resultMessage") {
        this.resultObject[subject].message = object;
      }

      if (predicate === "http://www.w3.org/ns/shacl#focusNode") {
        this.resultObject[subject].focusNode = object;
      }
    },
    navigate() {
      this.$router.push({
        path: process.env.VUE_APP_FRONTEND_PATH + "/"
      });
    }
  }
};
</script>
