<template>
    <div id="app">
        <router-view/>
        <vl-region>
            <vl-layout>
                <vl-grid>
                    <vl-column>
                        <vl-spotlight
                                title=""
                                subtitle=""
                                mod-large>
                            <p>
                                De validator maakt gebruik van de  ISA² Interoperability Test Bed software, dat ontwikkeld wordt door de Europese Commissie DG DIGIT.
                                Meer info hierover, zie <a href="https://joinup.ec.europa.eu/solution/interoperability-test-bed">hier</a>
                            </p>
                        </vl-spotlight>
                    </vl-column>
                </vl-grid>

            </vl-layout>
        </vl-region>
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
    @import "~@govflanders/vl-ui-spotlight/src/scss/spotlight";
</style>
