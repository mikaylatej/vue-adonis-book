<template>
    <div class="flex h-screen justify-center items-center flex-col">
        <h1 class="text-9xl">404</h1>
        <p class="mt-7 text-4xl">Page not found</p>
        <button @click="handleError" class="mt-7 rounded-full bg-sky-300 hover:bg-sky-400 px-3 py-1 float-right ml-2">Go to login</button>
        </div>
</template>

<script setup> 
const handleError = () => {
    navigateTo('/')
}
</script>