<template>
<div>
    <vl-region>
        <vl-layout>
            <vl-grid>
                <vl-column>
                    <vl-tabs ref="tabs">
                        <vl-tab label="Valideer een bestand" id="file">
                            <vl-title tag-name="h3">Kies een bestand</vl-title>
                            <vl-upload id="dataFile" name="dataFile" @upload-file-added="fileAdded" url="https://httpbin.org/post" upload-drag-text="Of sleep het databestand naar hier om het toe te voegen." upload-label="Databestand toevoegen" max-files="1" max-files-msg="Je mag maar 1 bestand tegelijk uploaden" max-filesize="20000000" max-filesize-msg="Het bestand mag max 20000000 zijn." allowed-file-types=".ttl, .rdf, .xml, .json, .jsonld, .html" />
                        </vl-tab>
                        <vl-tab label="Valideer een URL" id="url">
                            <vl-grid>
                                <vl-column width="1">
                                    <vl-title tag-name="h3">URL</vl-title>
                                </vl-column>
                                <vl-column width="5">
                                    <vl-input-field v-model="Url" name="inputFieldURL" mod-block></vl-input-field>
                                </vl-column>
                            </vl-grid>
                        </vl-tab>
                    </vl-tabs>
                </vl-column>
            </vl-grid>
        </vl-layout>
    </vl-region>
    <vl-region>
        <vl-layout>
            <vl-grid>
                <vl-column width="2">
                    <vl-title tag-name="h3">Applicatieprofiel</vl-title>
                </vl-column>
                <vl-column width="3">
                    <vl-select v-model="selectedApplicationProfile">
                        <option v-for="ap in this.applicationProfiles" v-bind:key="ap" :value="ap.toLowerCase()">
                            {{ ap.replace('_', ' ') }}
                        </option>
                    </vl-select>
                </vl-column>
                <vl-column v-if="selectError">
                    <p style="color: red">Gelieve een applicatieprofiel te kiezen.</p>
                </vl-column>
            </vl-grid>
        </vl-layout>
    </vl-region>
    <vl-region>
        <vl-layout>
            <vl-grid>
                <vl-column>
                    <vl-button @click="validate" mod-wide>
                        Valideer
                    </vl-button>
                </vl-column>
            </vl-grid>
        </vl-layout>
    </vl-region>
</div>
</template>

<script>
import UploadComponentVue from '../components/UploadComponent.vue';
import store from "../store/store";

const RdfaParser = require("rdfa-streaming-parser").RdfaParser;
const fileReaderStream = require('filereader-stream');
const N3 = require('n3');
const Base64 = require('js-base64').Base64;

export default {
    name: "HomeComponent",
    components: {
        'upload-component': UploadComponentVue
    },
    data() {
        return {
            applicationProfiles: [
                'Adresregister', 'Besluit_Publicatie', 'Dienstencataloog', 'Generiek_basis', 'Generieke_Terugmeldfaciliteit',
                'Notificatie_basis', 'Organisatie_basis', 'Persoon_basis', 'Subsidieregister',
                'Contactvoorkeuren', 'Dienst_Transactiemodel', 'Vlaamse_codex'
            ],
            uploadedFile: null,
            fileUploadError: false,
            selectedApplicationProfile: '',
            selectError: false,
            Url: '',
            UrlInputError: false
        }
    },
    methods: {
        fileAdded(file) {
            this.uploadedFile = file;
        },
        async transformRDFaToTurtle() {
            const parser = new RdfaParser();
            const readStream = fileReaderStream(this.uploadedFile);
            const writer = new N3.Writer();

            return await new Promise(resolve => {
                parser.import(readStream)
                    .on('data', quad => {
                        writer.addQuad(quad);
                    })
                    .on('error', console.error)
                    .on('end', () => {
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
            const extension = fileName.substring(fileName.indexOf('.') + 1, fileName.length);

            switch (extension) {
                case 'ttl':
                    return 'text/turtle';

                case 'jsonld':
                    return 'application/ld+json';

                case 'xml':
                    return 'application/rdf+xml';

                case '.nt':
                    return 'application/n-triples';
            }
        },
        isRDFaFile() {
            return this.uploadedFile.name.indexOf('.html') >= 0;
        },
        applicationProfileWasSelected() {
            if (this.selectedApplicationProfile === '') {
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
                    }

                    reader.onerror = () => {
                        console.log('Error: ', error);
                    };

                    reader.readAsDataURL(this.uploadedFile);
                });
            }

            return data;
        },
        createRequestBodyForFile(data, isRDFaFile) {
            const body = {
                embeddingMethod: "BASE64",
                validationType: this.selectedApplicationProfile //GIVES ERROR
            };

            if (isRDFaFile) {
                body["contentToValidate"] = Base64.encode(data);
                body["contentSyntax"] = "text/turtle";
            } else {
                body["contentToValidate"] = data.substring(data.indexOf(",") + 1, data.length);
                data["contentSyntax"] = this.getContentFormat(this.uploadedFile.name);
            }

            return body;
        },
        createRequestBodyForUrl() {
            return JSON.stringify({
                contentToValidate: this.Url,
                validationType: this.selectedApplicationProfile
            });
        },
        async validate() {
            const index = this.$refs.tabs.activeTabIndex;
            let requestBody = '';

            if (index === 0) {
                const data = await this.readFile();
                console.log(data);
                requestBody = this.createRequestBodyForFile(data, this.isRDFaFile);
            } else {
                requestBody = this.createRequestBodyForUrl();
            }

            console.log(requestBody);

            store.commit('setRequestBody', requestBody);

            fetch('http://localhost:8080/shacl/applicatieprofielen/api/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            }).then(res => {
                store.commit('setResult', res);
                this.$router.push({
                    path: 'results'
                });
            });
        },
    }
}
</script>

<style lang="scss">
select {
    width: 150%;
}
</style>
