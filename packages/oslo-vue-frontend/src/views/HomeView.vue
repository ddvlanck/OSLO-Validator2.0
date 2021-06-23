<template>
<div>
    <vl-region>
        <vl-layout>
            <vl-grid>
                <vl-column>
                    <vl-tabs ref="tabs">
                        <vl-tab label="Valideer een bestand" id="file">
                            <upload-component v-on:onFileAdded="onFileAdded"/>
                        </vl-tab>
                        <vl-tab label="Valideer een URL" id="url">
                            <input-component v-on:onInputChanged="onUrlInput"/>
                        </vl-tab>
                    </vl-tabs>
                </vl-column>
            </vl-grid>
        </vl-layout>
    </vl-region>
    <vl-region>
        <vl-layout>
            <select-component v-on:onChangeSelect="onApplicationProfileChange"/>
        </vl-layout>
    </vl-region>
    <vl-region>
        <vl-layout>
            <vl-grid>
                <vl-column>
                    <vl-button
                        @click="validate"
                        :mod-disabled="!contentCanbeValidated"
                        mod-wide>
                        Valideer
                    </vl-button>
                </vl-column>
            </vl-grid>
        </vl-layout>
    </vl-region>
</div>
</template>

<script>
import InputComponentVue from '../components/InputComponent.vue';
import SelectComponentVue from '../components/SelectComponent.vue';
import UploadComponent from '../components/UploadComponent.vue';
import store from "../store/store";

const RdfaParser = require("rdfa-streaming-parser").RdfaParser;
const fileReaderStream = require('filereader-stream');
const N3 = require('n3');
const Base64 = require('js-base64').Base64;

export default {
    name: "HomeComponent",
    components: {
        'upload-component': UploadComponent,
        'select-component' : SelectComponentVue,
        'input-component' : InputComponentVue
    },
    data() {
        return {
            file: null,
            applicationProfile: '',
            url: '',
            contentCanbeValidated: false
        }
    },
    methods: {
        onApplicationProfileChange(value){
            this.applicationProfile = value;
            this.checkIfContentCanBeValidated();
        },
        onUrlInput(value){
            this.url = value;
            this.checkIfContentCanBeValidated();
        },
        onFileAdded(file) {
            this.file = file;
            this.checkIfContentCanBeValidated();
        },
        checkIfContentCanBeValidated(){
            this.contentCanbeValidated = this.applicationProfile !== '' && (this.file !== null || this.url !== '');
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
