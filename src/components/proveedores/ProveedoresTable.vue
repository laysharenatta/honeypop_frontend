<template>

  table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Nombre</th>
        <th scope="col">Contacto</th>
        <th scope="col">Correo</th>
        <th scope="col">Telefono</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="proveedor in proveedores" :key="proveedor.id">
        <td>{{ proveedor.id }}</td>
        <td>{{ proveedor.nombre }}</td>
        <td>{{ proveedor.direccion }}</td>
        <td>{{ proveedor.telefono }}</td>
        <td>{{ proveedor.email }}</td>
      </tr>
    </tbody>

</template>

<script setup>
//imports
import { ref, onMounted } from 'vue';
import axios from 'axios';

const proveedores = ref([]);

const fetchProveedores = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/proveedores', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':' Bearer 20|wQK5lPvHfT6cMmKf9c8hao8vjrcHncGc6UsoDDWyed72773f'
      },
    });

    proveedores.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchProveedores();
});
</script>

