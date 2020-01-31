<template>
    <div>
        <vl-region>
            <vl-layout>
                <vl-button @click="navigate">Terug</vl-button>
            </vl-layout>
        </vl-region>
        <vl-region>
            <vl-layout>
                <vl-tabs>
                    <vl-tab label="Pretty">

                    </vl-tab>
                    <vl-tab label="Raw">

                    </vl-tab>
                </vl-tabs>
            </vl-layout>
        </vl-region>
    </div>
</template>

<script>
    export default {
        name: "ResultComponent",
        methods: {
            navigate(){
                this.$router.push({path: '/'})
            }
        }
    }
</script>

<style scoped>

</style>
