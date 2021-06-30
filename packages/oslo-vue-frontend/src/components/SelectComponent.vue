<template>
  <vl-grid>
    <vl-column width="2">
      <vl-title tag-name="h3">
        Applicatieprofiel
      </vl-title>
    </vl-column>
    <vl-column width="3">
      <vl-select
        :mod-error="showSelectError"
        placeholder-text="Selecteer een applicatieprofiel"
        @input="onChangeSelect"
        @blur="validateError()"
      >
        <option
          v-for="ap in applicationProfiles"
          :key="ap"
          :value="ap.toLowerCase()"
        >
          {{ ap.replace('_', ' ') }}
        </option>
      </vl-select>
    </vl-column>
    <vl-column v-if="showSelectError ">
      <p style="color: red">
        Gelieve een applicatieprofiel te kiezen.
      </p>
    </vl-column>
  </vl-grid>
</template>

<script>
export default {
  name : "SelectComponent",
  emits: ["onChangeSelect"],
  data() {
    return {
      applicationProfiles: [
        'Adresregister', 
        'Besluit_Publicatie', 
        'Dienstencataloog', 
        'Generiek_basis', 
        'Generieke_Terugmeldfaciliteit',
        'Notificatie_basis', 
        'Organisatie_basis', 
        'Persoon_basis', 
        'Subsidieregister',
        'Contactvoorkeuren', 
        'Dienst_Transactiemodel', 
        'Vlaamse_codex'
      ],
      showSelectError: false,
      applicationProfile: ''
    }
  },
  methods: {
    onChangeSelect(value){
      this.applicationProfile = value;
      this.showSelectError = false;
      this.$emit('onChangeSelect', value);
    },
    validateError(){
      if(this.applicationProfile === ''){
        this.showSelectError = true;
        return true;
      }

      this.showSelectError = false;
      return false;
    }
  }
}
</script>
