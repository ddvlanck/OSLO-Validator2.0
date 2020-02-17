<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang="scss">
    $vl-icon-font-location: "../assets/";
    @import "~@govflanders/vl-ui-core/src/scss/core";
    @import "~@govflanders/vl-ui-content-header/src/scss/content-header";
    @import "~@govflanders/vl-ui-tabs/src/scss/tabs";
    @import "~@govflanders/vl-ui-upload/src/scss/upload";
    @import "~@govflanders/vl-ui-icon/src/scss/icon";
    @import "~@govflanders/vl-ui-input-field/src/scss/input-field";
    @import "~@govflanders/vl-ui-textarea/src/scss/textarea";
    @import "~@govflanders/vl-ui-titles/src/scss/titles";
    @import "~@govflanders/vl-ui-select/src/scss/select";
    @import "~@govflanders/vl-ui-button/src/scss/button";
    @import "~@govflanders/vl-ui-info-tile/src/scss/info-tile";
    @import "~@govflanders/vl-ui-action-group/src/scss/action-group";
    @import "~@govflanders/vl-ui-link/src/scss/link";
</style>
