<template>
    <div>
        <vl-region>
            <vl-layout>
                <vl-button @click="navigate">Terug</vl-button>
            </vl-layout>
        </vl-region>
        <vl-region>
            <vl-layout>
                <vl-tabs>
                    <vl-tab label="Pretty">
                        <div v-if="Object.keys(this.resultObject).length > 0">
                            <vl-grid mod-stacked>
                                <vl-column v-for="result in resultObject">
                                    <vl-info-tile
                                            v-if="result.type === 'http://www.w3.org/ns/shacl#ValidationReport'"
                                            tag-name="div"
                                            class="overviewItem"
                                            title="ValidationReport"
                                            :subtitle="result.type">
                                        Conforms? <strong>{{result.conforms}}</strong>
                                        <br>
                                        Aantal fouten? <strong>{{Object.keys(resultObject).length - 1}}</strong>
                                    </vl-info-tile>
                                    <vl-info-tile
                                            v-else
                                            tag-name="div"
                                            class="errorItem"
                                            :title="result.message"
                                            :subtitle="result.type">
                                        Location: <strong>{{result.focusNode}}</strong><br>
                                        Result path: <strong>{{result.resultPath}}</strong>
                                    </vl-info-tile>
                                </vl-column>
                            </vl-grid>
                        </div>
                    </vl-tab>
                    <vl-tab label="Raw">
                        <vl-grid mod-stacked>
                            <vl-column width="4">
                                <vl-select id="select" @input="changeFormat" v-model="selectedFormat" placeholder-text="Selecteer een formaat">
                                    <option value="application/rdf+xml">
                                        Rdf/xml
                                    </option>
                                    <option value="application/ld+json">
                                        JSON-LD
                                    </option>
                                    <option value="text/turtle">
                                        Turtle
                                    </option>
                                    <option selected value="application/n-triples">
                                        N-Triples
                                    </option>
                                </vl-select>
                            </vl-column>
                            <vl-column width="8">
                                <vl-link :download="nameDownloadFile" :href="downloadLink">
                                    <vl-icon icon="file-download"/>
                                    Download
                                </vl-link>
                            </vl-column>
                            <vl-column>
                                <vl-textarea disabled mod-block :value="displayedResult"></vl-textarea>
                            </vl-column>
                        </vl-grid>
                    </vl-tab>
                </vl-tabs>
            </vl-layout>
        </vl-region>
    </div>
</template>

<script>
    import {RdfXmlParser} from "rdfxml-streaming-parser";
    import store from "../store/store";

    const Stream = require('stream');

    export default {
        name: "ResultComponent",
        data() {
            return {
                resultObject: {},
                selectedFormat: 'application/rdf+xml',
                displayedResult: '',
                downloadLink: '',
                nameDownloadFile: ''
            }
        },
        methods: {
            processResult(result) {
                const decoder = new TextDecoder('utf-8');
                const reader = result.body.getReader();
                reader.read().then(({value, done}) => {
                    this.parseResult(decoder.decode(value));
                });
            },
            parseResult(rdfXML) {
                // Default format is rdf/xml
                // We format the xml to show in on the 'raw' tab
                this.displayedResult = rdfXML;

                // Parse RDF/XML data to create 'pretty' result area
                this.resultObject = {};
                let stream = new Stream();
                stream.readable = true;
                const myParser = new RdfXmlParser();

                stream.pipe(myParser)
                    .on('data', this.processQuad)
                    .on('error', console.error)
                    .on('end', () => {
                        console.log('All triples were parsed!');
                    });

                stream.emit('data', rdfXML);
                stream.emit('end', ''); // Send end event -- OK?

            },
            processQuad(quad) {
                const subject = quad.subject.value;
                const predicate = quad.predicate.value;
                const object = quad.object.value;

                // More data can be extracted if needed

                if (!this.resultObject[subject]) {
                    this.resultObject[subject] = {};
                }

                if (predicate === 'http://www.w3.org/ns/shacl#conforms') {
                    this.resultObject[subject].conforms = object;
                }

                if (predicate === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
                    this.resultObject[subject].type = object;
                }

                if (predicate === 'http://www.w3.org/ns/shacl#resultPath') {
                    this.resultObject[subject].resultPath = object;
                }

                if (predicate === 'http://www.w3.org/ns/shacl#resultMessage') {
                    this.resultObject[subject].message = object;
                }

                if(predicate === 'http://www.w3.org/ns/shacl#focusNode'){
                    this.resultObject[subject].focusNode = object;
                }

            },
            navigate() {
                this.$router.push({path: process.env.VUE_APP_FRONTEND_PATH + '/'})
            },
            changeFormat() {
                //TODO: in future we need to fix the serializations with rdf instead of querying the validator
                const requestBody = JSON.parse(store.getters.RequestBody);
                requestBody.reportSyntax = this.selectedFormat;

                fetch(process.env.VUE_APP_HOSTNAME_URL +  process.env.VUE_APP_BACKEND_PATH + '/shacl/applicatieprofielen/api/validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }).then(result => {
                    const decoder = new TextDecoder('utf-8');
                    const reader = result.body.getReader();
                    reader.read().then(({value, done}) => {
                        // Show result in the textarea
                        this.displayedResult = decoder.decode(value);

                        // Make this result available to download
                        this.downloadLink = "data:application/octet-stream;base64," + btoa(decoder.decode(value));
                        this.nameDownloadFile = 'result';

                        switch (this.selectedFormat) {
                            case "application/ld+json":
                                this.nameDownloadFile += '.jsonld';
                                break;
                            case "application/rdf+xml":
                                this.nameDownloadFile += '.xml';
                                break;
                            case 'text/turtle':
                                this.nameDownloadFile += '.ttl';
                                break;
                            case 'application/n-triples':
                                this.nameDownloadFile += '.nt';
                                break;
                        }

                    });
                }).catch( err => {
                    console.log(err);
                })
            }
        },
        mounted() {
            document.getElementById('select').getElementsByTagName('option')[1].selected = true;
            const result = store.getters.ShaclResult;
            if (result) {
                this.processResult(result);
            }
        }
    }
</script>

<style scoped>
    .errorItem {
        background-color: #F2DEDE;
        border: 1px solid red;
    }

    .overviewItem {
        background-color: lightgrey;
    }

    textarea {
        resize: none;
        height: 800px;
    }

    .vl-link {
        float: right;
    }
</style>
