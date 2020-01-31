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
                                        allowed-file-types=".ttl, .rdf, .xml, .json, .jsonld"/>
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
                                {{ ap }}
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
    export default {
        name: "HomeComponent",
        data() {
            return {
                applicationProfiles: [
                    'Persoon'
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
            validate() {
                console.log("GOT YA");
                this.$router.push({path: 'results'});
                /*const index = this.$refs.tabs.activeTabIndex;

                if (!this.selectedAP) {
                    this.selectedAPError = true;

                } else {

                    this.selectedAPError = false;

                    if (index === 0) {
                        // File
                        if(!this.shaclFile){
                            this.shaclFileError = true;
                        } else {
                            this.shaclFileError = false;

                            // Read contents of the file
                            const reader = new FileReader();
                            reader.onload = () => {
                                const data = reader.result;

                                // Send content to validator
                                fetch('http://localhost:8080/shacl/bedrijventerrein/api/validate', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        contentToValidate: data,
                                        contentSyntax: 'application/ld+json',
                                        validationType: 'persoon'
                                    })
                                }).then( res => {
                                    console.log(res);
                                })
                            };

                            reader.onerror = () => {
                                // TODO
                                console.log('Error: ', error);
                            };

                            reader.readAsDataURL(this.shaclFile);

                            // Send content
                        }
                    } else {
                        // URL
                        if(!this.URL){
                            this.URLError = true;
                        } else {
                            this.URLError = false;

                            // Send URL
                        }
                    }
                }*/


            },
        }
    }
</script>

<style lang="scss">

    iframe {
        width: 100%;
        height: 750px;
    }

    select {
        width: 150%;
    }
</style>
