<template>
    <div>
        <vl-region>
            <vl-layout>
                <vl-button @click="navigate">Terug</vl-button>

                <button @click="parseResult">Test</button>
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
                                        title = "ValidationReport"
                                        :subtitle = "result.type">
                                        Conforms? <strong>{{result.conforms}}</strong>
                                        <br>
                                        Aantal fouten? <strong>{{Object.keys(resultObject).length - 1}}</strong>
                                    </vl-info-tile>
                                    <vl-info-tile
                                        v-else
                                        tag-name="div"
                                        class="errorItem"
                                        :title = "result.message"
                                        :subtitle = "result.type">
                                        Location: <strong>{{result.resultPath}}</strong>
                                    </vl-info-tile>
                                </vl-column>
                            </vl-grid>
                        </div>
                    </vl-tab>
                    <vl-tab label="Raw">
                        <vl-action-group mod-align-right mod-bordered mod-collapse-m>
                            <!-- EXAMPLE -->
                            <!--<vl-link download="validationResult.jsonld" href="data:application/octet-stream;charset=utf-16le;base64,//5mAG8AbwAgAGIAYQByAAoA"><vl-icon icon="file-download"/> JSON-LD</vl-link>-->
                            <vl-link href="#"><vl-icon icon="file-download"/> JSON-LD</vl-link>
                            <vl-link href="#"><vl-icon icon="file-download"/> RDF/XML</vl-link>
                            <vl-link href="#"><vl-icon icon="file-download"/> N-Triples</vl-link>
                            <vl-link href="#"><vl-icon icon="file-download"/> Turtle</vl-link>
                        </vl-action-group>
                    </vl-tab>
                </vl-tabs>
            </vl-layout>
        </vl-region>
    </div>
</template>

<script>
    import {RdfXmlParser} from "rdfxml-streaming-parser";

    const Stream = require('stream');


    export default {
        name: "ResultComponent",
        data() {
            return {
                resultObject: {},
                counter: 0
            }
        },
        methods: {
            parseResult() {
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


                stream.emit('data', data);
                stream.emit('end', ''); // Send end event -- OK?

            },
            processQuad(quad) {
                ;const subject = quad.subject.value;
                const predicate = quad.predicate.value;
                const object = quad.object.value;

                // More data can be extracted if needed

                if (!this.resultObject[subject]) {
                    this.counter++;
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

            },
            navigate() {
                this.$router.push({path: '/'})
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
</style>
