<template>

<Navbar v-if="isAuthenticated" />
<RouterView />
</template>

<script setup>
import Navbar  from "@/components/widgets/Navbar.vue";
import { RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth';

const { isAuthenticated } = useAuth();
</script>
