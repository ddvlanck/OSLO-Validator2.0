<template>
    <div>
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
    </div>
</template>

<script>
    export default {
        name : 'UploadComponent'
    }
</script>