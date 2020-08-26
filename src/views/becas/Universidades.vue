<template>
<div>

    Universidades {{ becas.titulo }}

    <List :headers="becas.headers" :items="becas.becasTotal" />

</div>
</template>

<script>
import Becas from '@/store/becas/Convocatorias';
import List from '@/components/becas/shared/List';
export default {
    name: "Becas",

    components: {
        List,
    },
    created() {
        this.becas = Becas.state;
    },
    data: () => ({}),
}
</script>
