<template>
  <vl-grid mod-stacked>
    <vl-column
      v-for="result in resultObject"
      :key="result.type"
    >
      <vl-info-tile
        v-if="result.type === 'http://www.w3.org/ns/shacl#ValidationReport'"
        tag-name="div"
        class="overviewItem"
        title="ValidationReport"
        :subtitle="result.type"
      >
        Conforms? <strong>{{ result.conforms }}</strong>
        <br>
        Aantal fouten?
        <strong>{{ Object.keys(resultObject).length - 1 }}</strong>
      </vl-info-tile>
      <vl-info-tile
        v-else
        tag-name="div"
        class="errorItem"
        :title="result.message"
        :subtitle="result.type"
      >
        Location: <strong>{{ result.focusNode }}</strong><br>
        Result path: <strong>{{ result.resultPath }}</strong>
      </vl-info-tile>
    </vl-column>
  </vl-grid>
</template>

<script>
export default {
  name: "ResultPrettyComponent",
  props: {
    resultObject: {
      type: Object,
      default: null
    }
  }
};
</script>

<style lang="scss">
.errorItem {
  background-color: #f2dede;
  border: 1px solid red;
}

.overviewItem {
  background-color: lightgrey;
}
</style>
