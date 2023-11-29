<template>
    <div>
        <NavBar />
        <div class="flex justify-center">
            <p class="text-2xl font-bold py-5 w-5/6">Unauthorized to access this page</p>
        </div>
    </div>
</template>

<script>
import NavBar from '../components/layout/NavBar.vue';

export default {
    components: {
        NavBar
    },
}
</script>