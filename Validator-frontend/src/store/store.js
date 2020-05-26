import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        shaclResult: null,
        requestBody: null,
        applicationProfiles: null
    },

    getters: {
        ShaclResult: state => {
            return state.shaclResult;
        },
        RequestBody: state => {
            return state.requestBody;
        },
        ApplicationProfiles: state => {
            return state.applicationProfiles
        }
    },

    mutations: {
        setResult(state, result){
            state.shaclResult = result;
        },
        setRequestBody(state, body){
            state.requestBody = body;
        },
        setApplicationProfiles(state, body){
            state.applicationProfiles = body;
        }
    },

    actions: {
    }
});
