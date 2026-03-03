<template>

<Navbar v-if="isAuthenticated" />
<RouterView />
</template>

<script setup>
import { ref } from 'vue'
import Navbar  from "@/components/widgets/Navbar.vue";
import { RouterView } from 'vue-router'

const isAuthenticated = ref(localStorage.getItem('token'));
</script>
