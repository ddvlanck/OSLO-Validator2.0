<template>
    <div>
        <vl-region>
            <vl-layout>
                <vl-grid>
                    <vl-column>
                        <vl-tabs ref="tabs">
                            <vl-tab label="Valideer een bestand" id="file">
                                <vl-title tag-name="h3">Kies een bestand</vl-title>
                                <vl-upload
                                        id="dataFile"
                                        name="dataFile"
                                        @upload-file-added="fileAdded"
                                        url="https://httpbin.org/post"
                                        upload-drag-text="Of sleep het databestand naar hier om het toe te voegen."
                                        upload-label="Databestand toevoegen"
                                        max-files="1"
                                        max-files-msg="Je mag maar 1 bestand tegelijk uploaden"
                                        max-filesize="20000000"
                                        max-filesize-msg="Het bestand mag max 20000000 zijn."
                                        allowed-file-types=".ttl, .rdf, .xml, .json, .jsonld, .html"/>
                            </vl-tab>
                            <vl-tab label="Valideer een URL" id="url">
                                <vl-grid>
                                    <vl-column width="1">
                                        <vl-title tag-name="h3">URL</vl-title>
                                    </vl-column>
                                    <vl-column width="5">
                                        <vl-input-field v-model="URL" name="inputFieldURL" mod-block></vl-input-field>
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
                        <vl-select v-model="selectedAP">
                            <option v-for="ap in this.applicationProfiles" :value="ap.toLowerCase()">
                                {{ ap.replace('_', ' ') }}
                            </option>
                        </vl-select>
                    </vl-column>
                    <vl-column v-if="selectedAPError">
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

    import store from "../store/store";

    const RdfaParser = require("rdfa-streaming-parser").RdfaParser;
    const fileReaderStream = require('filereader-stream');
    const N3 = require('n3');

    export default {
        name: "HomeComponent",
        data() {
            return {
                applicationProfiles: [
                    'Adresregister', 'Besluit_Publicatie', 'Dienstencataloog', 'Generiek_basis', 'Generieke_Terugmeldfaciliteit',
                    'Notificatie_basis', 'Organisatie_basis', 'Persoon_basis', 'Subsidieregister',
                    'Contactvoorkeuren', 'Dienst_Transactiemodel', 'Vlaamse_codex'
                ],
                shaclFile: null,
                shaclFileError: false,
                selectedAP: '',
                selectedAPError: false,
                URL: '',
                URLError: false
            }
        },
        methods: {
            fileAdded(file) {
                this.shaclFile = file;
            },
            async transformRDFaToTurtle() {
                const parser = new RdfaParser();
                const readStream = fileReaderStream(this.shaclFile);
                const writer = new N3.Writer();

                return await new Promise(resolve => {
                    parser.import(readStream)
                        .on('data', quad => {
                            writer.addQuad(quad);
                        })
                        .on('error', console.error)
                        .on('end', () => {
                            writer.end((err, res) => {
                                if(err){
                                    console.error(err);
                                }

                                resolve(res);
                            });
                        });
                });
            },
            getContentFormat(fileName){
                const extension = fileName.substring(fileName.indexOf('.') + 1, fileName.length);
                switch (extension) {
                    case 'ttl':
                        return 'text/turtle';
                        break;
                    case 'jsonld':
                        return 'application/ld+json';
                        break;
                    case 'xml':
                        return 'application/rdf+xml';
                        break;
                    case '.nt':
                        return 'application/n-triples';
                        break;
                }
            },
            async validate() {
                const index = this.$refs.tabs.activeTabIndex;
                let requestBody = '';

                if (!this.selectedAP) {
                    this.selectedAPError = true;
                } else {
                    this.selectedAPError = false;

                    if (index === 0) {
                        // File
                        if (!this.shaclFile) {
                            this.shaclFileError = true;
                            return;
                        } else {
                            this.shaclFileError = false;

                            // In case of an RDFa file, we must transform it to another format because the EU validator does not support RDFa (yet)
                            if(this.shaclFile.name.indexOf('.html') >= 0){
                                const ttl = await this.transformRDFaToTurtle();
                                requestBody = JSON.stringify({
                                   contentToValidate: btoa(ttl),
                                    embeddingMethod: "BASE64",
                                    contentSyntax: 'text/turtle',
                                    validationType: this.selectedAP
                                });
                            } else {
                                // Read contents of the regular file
                                const reader = new FileReader();

                                requestBody = await new Promise(resolve => {
                                    reader.onload = () => {
                                        const data = reader.result;
                                        const base64 = data.substring(data.indexOf(',') + 1, data.length);
                                        resolve(JSON.stringify({
                                            contentToValidate: base64,
                                            embeddingMethod: "BASE64",
                                            contentSyntax: this.getContentFormat(this.shaclFile.name),
                                            validationType: this.selectedAP
                                        }));
                                    };

                                    reader.onerror = () => {
                                        console.log('Error: ', error);
                                    };

                                    reader.readAsDataURL(this.shaclFile);
                                })
                            }
                        }

                    } else {
                        // URL
                        if (!this.URL) {
                            this.URLError = true;
                            return;
                        } else {
                            this.URLError = false;

                            // Send URL
                            requestBody = JSON.stringify({
                                contentToValidate: this.URL,
                                validationType: this.selectedAP
                            })
                        }
                    }

                    // TODO:
                    //  Now the body is stored so it can be used in the result to retrieve other formats of the result
                    //  In the future this needs to be deleted and fixed with rdf serializers
                    store.commit('setRequestBody', requestBody);
;
                    // Send content to validator
                    fetch(process.env.VUE_APP_HOSTNAME_URL +  process.env.VUE_APP_BACKEND_PATH + '/shacl/applicatieprofielen/api/validate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: requestBody
                    }).then(res => {
                        store.commit('setResult', res);
                        this.$router.push({path: 'results'});
                    })
                }
            },
        }
    }
</script>

<style lang="scss">

    select {
        width: 150%;
    }
</style>
