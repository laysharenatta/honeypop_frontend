<template>

<Navbar />
<RouterView />
</template>

<script setup>
import Navbar  from "@/components/widgets/Navbar.vue";
import { RouterView } from 'vue-router'
</script>
