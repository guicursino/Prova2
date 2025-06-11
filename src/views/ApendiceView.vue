<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Inclua um apendice</h1>

    <!-- Campo para consulta local por ID -->
    <div class="mb-4">
      <input v-model.number="consultaId" placeholder="Buscar revisão por ID" class="border p-2" />
    </div>

    <!-- Exibe resultado da consulta local -->
    <div v-if="apendiceEncontrado" class="mb-4 p-4 border rounded bg-gray-100">
      <p><strong>ID:</strong> {{ apendiceEncontrado.id }}</p>
      <p><strong>Texto:</strong> {{ apendiceEncontrado.conteudo }}</p>
      <p><strong>Título:</strong> {{ apendiceEncontrado.tituloTrabalho }}</p>
      <p><strong>Grupo:</strong> {{ apendiceEncontrado.nomeGrupo }}</p>
      <p><strong>Data/Hora:</strong> {{ apendiceEncontrado.data_hora }}</p>
      <p><strong>Data/HoraAprovacao</strong> {{ apendiceEncontrado.data_hora_aprovacao }}</p>
    </div>

    <!-- Filtros -->
    <div class="mb-4 flex gap-4">
      <input v-model="filtros.titulo" placeholder="Filtrar por título" class="border p-2" />
      <input v-model.number="filtros.data_hora" type="number" min="1" max="5" placeholder="Filtrar por data/hora" class="border p-2" />
    </div>

    <!-- Tabela -->
    <table class="table-auto border w-full">
      <thead class="bg-gray-200">
        <tr>
          <th class="border px-4 py-2">ID</th>
          <th class="border px-4 py-2">Texto</th>
          <th class="border px-4 py-2">Título</th>
          <th class="border px-4 py-2">Grupo</th>
          <th class="border px-4 py-2">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rev in revisoesFiltradas" :key="rev.id">
          <td class="border px-4 py-2">{{ ape.id }}</td>
          <td class="border px-4 py-2">{{ ape.texto }}</td>
          <td class="border px-4 py-2">{{ ape.tituloTrabalho }}</td>
          <td class="border px-4 py-2">{{ ape.nomeGrupo }}</td>
          <td class="border px-4 py-2">{{ calcularEstado(ape.data_hora, ape.data_hora_aprovacao) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Formulário -->
    <h2 class="text-xl font-semibold mt-6 mb-2">Novo Apendice</h2>
    <form @submit.prevent="salvarLocal" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="form.texto" placeholder="Texto" class="border p-2" required />
      <input v-model="form.tituloTrabalho" placeholder="Título do Trabalho" class="border p-2" required />
      <input v-model="form.nomeGrupo" placeholder="Nome do Grupo" class="border p-2" required />
      <input v-model.number="form.data_hora" type="number" placeholder="Data/Hora" class="border p-2" required />
      <input v-model.number="form.data_hora_aprovacao" type="number" placeholder="Data/HoraAprovacao" class="border p-2" required />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded col-span-full w-fit">Salvar</button>
    </form>
    <p v-if="erro" class="text-red-500 mt-2">{{ erro }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { listarApendices } from '@/services/apendiceService';

interface Apendice {
  id: number;
  texto: string;
  tituloTrabalho: string;
  nomeGrupo: string;
  data_hora: number | null;
  data_hora_aprovacao: number | null;
}

const apendices = ref<Revisao[]>([]);
const erro = ref('');
const filtros = ref({ titulo: '', data_hora: null });

const form = ref({
  texto: '',
  tituloTrabalho: '',
  nomeGrupo: '',
  data_hora: null,
  data_hora_aprovacao: null,
});

// Variáveis para consulta local por ID
const consultaId = ref<number | null>(null);
const apendiceEncontrado = computed(() => {
  if (consultaId.value === null) return null;
  return revisoes.value.find(r => r.id === consultaId.value) || null;
});

const calcularEstado = (data_hora: number | null, data_hora_aprovacao: number | null) => {
  if ((data_hora_aprovacao !== null && data_hora_aprovacao <= 3) || (data_hora !== null && data_hora >= 4)) return 'fatal';
  if ((data_hora_aprovacao !== null && data_hora_aprovacao <= 7) || (data_hora !== null && data_hora >= 3)) return 'grave';
  return 'pendente';
};

const carregar = async () => {
  apendices.value = await listarApendices();
};

// Função de salvar localmente, sem backend
const salvarLocal = async () => {
  try {
    const novoId = apendices.value.length > 0 ? Math.max(...apendices.value.map(a => a.id)) + 1 : 1;

    const novoApendice: Apendice = {
      id: novoId,
      texto: form.value.texto,
      tituloTrabalho: form.value.tituloTrabalho,
      nomeGrupo: form.value.nomeGrupo,
      data_hora: form.value.data_hora,
      data_hora_aprovacao: form.value.data_hora_aprovacao,
    };

    apendices.value.push(novoApendice);

    form.value = { texto: '', tituloTrabalho: '', nomeGrupo: '', data_hora: null, nota: null };
    erro.value = '';
  } catch (e) {
    erro.value = 'Erro ao salvar apendice localmente.';
  }
};

const apendicesFiltrados = computed(() => {
  return apendices.value.filter((r) => {
    const tituloOk = !filtros.value.titulo || r.tituloTrabalho.toLowerCase().includes(filtros.value.titulo.toLowerCase());
    const data_horaOk = filtros.value.data_hora == null || a.data_hora === filtros.value.data_hora;
    return tituloOk && data_horaOk;
  });
});

onMounted(carregar);
</script>
