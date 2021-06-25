<template>
<vl-grid mod-stacked>
    <vl-column width="4">
        <vl-select @input="changeFormat" v-model="selectedFormat" placeholder-text="Selecteer een formaat">
            <option v-for="format in this.formats" v-bind:key="format.name" :value="format.mimeType">{{format.name}}</option>
        </vl-select>
    </vl-column>
    <vl-column width="8">
        <vl-link id="downloadLink" @click.prevent="download" :href="downloadLink">Download resultaat</vl-link>
    </vl-column>
    <vl-column>
        <vl-textarea disabled mod-block :value="displayedResult"></vl-textarea>
    </vl-column>
</vl-grid>
</template>

<script>
import store from "../store/store";

export default {
    name: "ResultRawComponent",
    props: {
        rawResult: String
    },
    data() {
        return {
            formats: [{
                    "name": "Rdf/xml",
                    "mimeType": "application/rdf+xml"
                },
                {
                    "name": "JSON-LD",
                    "mimeType": "application/ld+json"
                },
                {
                    "name": "Turtle",
                    "mimeType": "text/turtle"
                },
                {
                    "name": "N-Triples",
                    "mimeType": "application/n-triples"
                }
            ],
            selectedFormat: "application/rdf+xml",
            displayedResult: store.getters.ShaclResult,
            downloadLink: '',
            nameDownloadFile: ''
        }
    },
    methods: {
        changeFormat() {
            const requestBody = JSON.parse(store.getters.RequestBody);
            requestBody.reportSyntax = this.selectedFormat;

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(requestBody),
                redirect: 'follow'
            };

            fetch(config.hostnameUrlLocal + config.apiPath, requestOptions)
                .then(response => {
                    this.processResult(response);
                })
                .catch(error => console.log('error', error));
        },
        processResult(response) {
            const decoder = new TextDecoder('utf-8');
            const reader = response.body.getReader();
            reader.read().then(({
                value,
                done
            }) => {
                this.displayedResult = decoder.decode(value);
                this.createDownloadLink();
            });
        },
        createDownloadLink() {
            let extension = '';
            switch (this.selectedFormat) {
                case "application/ld+json":
                    extension = '.jsonld';
                    break;

                case "application/rdf+xml":
                    extension = '.xml';
                    break;

                case 'text/turtle':
                    extension = '.ttl';
                    break;

                case 'application/n-triples':
                    extension = '.nt';
                    break;

                default:
                    throw Error("Format is not supported.");
            }
            this.nameDownloadFile = `result.${extension}`;
        },
        download(){
            const blob = new Blob([this.displayedResult], { type: 'data:text/plain' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = this.nameDownloadFile;
            link.click()
            URL.revokeObjectURL(link.href);
        }
    },
    watch : {
        rawResult: function(val){
            this.displayedResult = val;
            this.createDownloadLink();
        }
    }
}
</script>

<style scoped>
textarea {
    resize: none;
    height: 800px;
}

#downloadLink {
    float: right;
}
</style>
