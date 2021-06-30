<template>
  <vl-grid>
    <vl-column width="1">
      <vl-title tag-name="h3">
        URL
      </vl-title>
    </vl-column>
    <vl-column width="5">
      <vl-input-field
        v-model="url"
        name="inputFieldURL" 
        mod-block 
        :mod-error="urlInputError()" 
        @input="inputChanged"
        @focus="setInputSelectedValue(true)"
        @blur="inputHasValue"
      />
    </vl-column>
    <vl-column v-if="urlInputError()">
      <p style="color: red">
        Gelieve een URL mee te geven
      </p>
    </vl-column>
  </vl-grid>
</template>

<script>
export default {
  name : "InputComponent",
  emits: ['onInputChanged'],
  data() {
    return {
        urlProvided: null,
        inputSelected: null,
        url: ''
    }
  },
  methods: {
    inputChanged(value){
        this.$emit('onInputChanged', value);
    },
    inputHasValue(){
        this.setInputSelectedValue(false);
        this.urlProvided = this.url === ''? false: true;
    },
    setInputSelectedValue(value){
        this.inputSelected = value;
    },
    urlInputError(){
        return this.inputSelected !== null && !this.inputSelected && this.urlProvided !== null && !this.urlProvided;
    }
  }
}
</script>
