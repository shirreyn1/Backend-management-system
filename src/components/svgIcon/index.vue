<template>
    <svg :style="{ width, height }">
        <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
</template>

<script setup>
defineProps({
    prefix: {
        type: String,
        default: '#icon-',
    },
    name: String,
    color: {
        type: String,
        default: '',
    },
    width: {
        type: String,
        default: '30px',
    },
    height: {
        type: String,
        default: '30px',
    },
})
</script>

<style scoped></style>
