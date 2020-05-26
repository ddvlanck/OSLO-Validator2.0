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
                            <option v-for="ap in this.applicationProfiles" :value="ap.toLowerCase().replace(' ', '_')">
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

    import store from "../store/store";
console.log('HOME');

    export default {
        name: "HomeComponent",
        data() {
            return {
                applicationProfiles: [],
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

                            // Read contents of the file
                            const reader = new FileReader();

                            requestBody = await new Promise(resolve => {
                                reader.onload = () => {
                                    const data = reader.result;
                                    const base64 = data.substring(data.indexOf(',') + 1, data.length);
                                    resolve(JSON.stringify({
                                        contentToValidate: base64,
                                        embeddingMethod: "BASE64",
                                        contentSyntax: 'application/ld+json',   // TODO: aanpassen naar extensie van het bestand
                                        validationType: this.selectedAP
                                    }));
                                };

                                reader.onerror = () => {
                                    console.log('Error: ', error);
                                };

                                reader.readAsDataURL(this.shaclFile);
                            })
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

                    // Send content to validator
                    fetch('https://dev.data.vlaanderen.be/shacl-validator-backend/shacl/applicatieprofielen/api/validate', {
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
        },
        beforeCreate() {
            // Read config of the backend to get all application profiles
            fetch('https://raw.githubusercontent.com/Informatievlaanderen/OSLO-Validator-EU/dev/Validator-Backend/resources/applicatieprofielen/config.properties')
                .then(res => res.text())
                .then(data => {
                    const result = data.match(/validator.typeLabel.[a-zA-Z0-9 =_]*/g);
                    let names = [];
                    for(let ap of result){
                        names.push(ap.replace(/validator.typeLabel.[a-zA-Z_]*( )?=( )?/, ""));
                    }

                    store.commit('setApplicationProfiles', names);
                    this.applicationProfiles = store.getters.ApplicationProfiles;
                })

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
