<template>
  <div id="app">
    <vl-region>
      <vl-layout>
        <!-- VERSION 1 -->
        <iframe src="http://localhost:8080/shacl/bedrijventerrein/uploadm"></iframe>
        <hr>
        <!-- VERSION 2 -->
      </vl-layout>
    </vl-region>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {

  }
}
</script>

<style lang="scss">
  $vl-icon-font-location: "../assets/";
  @import "~@govflanders/vl-ui-core/src/scss/core";
  @import "~@govflanders/vl-ui-content-header/src/scss/content-header";

  iframe {
    width: 100%;
    height: 400px;
  }
</style>
