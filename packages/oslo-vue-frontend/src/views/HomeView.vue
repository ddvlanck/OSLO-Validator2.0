<template>
  <div>
    <vl-region>
      <vl-layout>
        <vl-grid>
          <vl-column>
            <vl-tabs ref="tabs">
              <vl-tab
                id="file"
                label="Valideer een bestand"
              >
                <upload-component @onFileAdded="onFileAdded" />
              </vl-tab>
              <vl-tab
                id="url"
                label="Valideer een URL"
              >
                <input-component @onInputChanged="onUrlInput" />
              </vl-tab>
            </vl-tabs>
          </vl-column>
        </vl-grid>
      </vl-layout>
    </vl-region>
    <vl-region>
      <vl-layout>
        <select-component @onChangeSelect="onApplicationProfileChange" />
      </vl-layout>
    </vl-region>
    <vl-region>
      <vl-layout>
        <vl-grid>
          <vl-column>
            <vl-button
              :mod-disabled="!contentCanbeValidated"
              mod-wide
              @click="validate"
            >
              Valideer
            </vl-button>
          </vl-column>
        </vl-grid>
      </vl-layout>
    </vl-region>
  </div>
</template>

<script>
import InputComponentVue from "../components/InputComponent.vue";
import SelectComponentVue from "../components/SelectComponent.vue";
import UploadComponent from "../components/UploadComponent.vue";
import config from "../config";
import store from "../store/store";

const RdfaParser = require("rdfa-streaming-parser").RdfaParser;
const fileReaderStream = require("filereader-stream");
const N3 = require("n3");
const Base64 = require("js-base64").Base64;

export default {
  name: "HomeView",
  components: {
    "upload-component": UploadComponent,
    "select-component": SelectComponentVue,
    "input-component": InputComponentVue
  },
  data() {
    return {
      file: null,
      applicationProfile: "",
      url: "",
      contentCanbeValidated: false
    };
  },
  methods: {
    onApplicationProfileChange(value) {
      this.applicationProfile = value;
      this.checkIfContentCanBeValidated();
    },
    onUrlInput(value) {
      this.url = value;
      this.checkIfContentCanBeValidated();
    },
    onFileAdded(file) {
      this.file = file;
      this.checkIfContentCanBeValidated();
    },
    checkIfContentCanBeValidated() {
      this.contentCanbeValidated =
        this.applicationProfile !== "" &&
        (this.file !== null || this.url !== "");
    },
    async transformRDFaToTurtle() {
      const parser = new RdfaParser();
      const readStream = fileReaderStream(this.file);
      const writer = new N3.Writer();

      return await new Promise(resolve => {
        parser
          .import(readStream)
          .on("data", quad => {
            writer.addQuad(quad);
          })
          .on("error", console.error)
          .on("end", () => {
            writer.end((err, res) => {
              if (err) {
                console.error(err);
              }

              resolve(res);
            });
          });
      });
    },
    getContentFormat(fileName) {
      const extension = fileName.substring(
        fileName.indexOf(".") + 1,
        fileName.length
      );

      switch (extension) {
        case "ttl":
          return "text/turtle";

        case "jsonld":
          return "application/ld+json";

        case "xml":
          return "application/rdf+xml";

        case ".nt":
          return "application/n-triples";
      }
    },
    isRDFaFile() {
      return this.file.name.indexOf(".html") >= 0;
    },
    applicationProfileWasSelected() {
      if (this.selectedApplicationProfile === "") {
        return false;
      } else {
        return true;
      }
    },
    async readFile() {
      let data;

      if (this.isRDFaFile()) {
        data = await this.transformRDFaToTurtle();
      } else {
        const reader = new FileReader();

        data = await new Promise(resolve => {
          reader.onload = () => {
            resolve(reader.result);
          };

          reader.onerror = () => {
            console.log("Error: ", error);
          };

          reader.readAsDataURL(this.file);
        });
      }

      return data;
    },
    createRequestBodyForFile(data, isRDFaFile) {
      const body = {
        embeddingMethod: "BASE64",
        validationType: this.applicationProfile
      };

      if (isRDFaFile) {
        body["contentToValidate"] = Base64.encode(data);
        body["contentSyntax"] = "text/turtle";
      } else {
        body["contentToValidate"] = data.substring(
          data.indexOf(",") + 1,
          data.length
        );
        body["contentSyntax"] = this.getContentFormat(this.file.name);
      }

      return JSON.stringify(body);
    },
    createRequestBodyForUrl() {
      return JSON.stringify({
        contentToValidate: this.Url,
        validationType: this.selectedApplicationProfile
      });
    },
    async validate() {
      const index = this.$refs.tabs.activeTabIndex;
      let requestBody = "";

      if (index === 0) {
        const data = await this.readFile();
        requestBody = this.createRequestBodyForFile(data, this.isRDFaFile());
      } else {
        requestBody = this.createRequestBodyForUrl();
      }

      store.commit("setRequestBody", requestBody);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: requestBody,
        redirect: "follow"
      };

      fetch(config.hostnameUrlLocal + config.apiPath, requestOptions)
        .then(response => {
          store.commit("setResult", response);
          this.$router.push({ path: "results" });
        })
        .catch(error => console.log("error", error));
    }
  }
};
</script>

<style lang="scss">
select {
  width: 150%;
}
</style>
