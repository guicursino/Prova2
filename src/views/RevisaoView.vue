<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Revise um Trabalho</h1>

    <!-- Campo para consulta local por ID -->
    <div class="mb-4">
      <input v-model.number="consultaId" placeholder="Buscar revisão por ID" class="border p-2" />
    </div>

    <!-- Exibe resultado da consulta local -->
    <div v-if="revisaoEncontrada" class="mb-4 p-4 border rounded bg-gray-100">
      <p><strong>ID:</strong> {{ revisaoEncontrada.id }}</p>
      <p><strong>Conteúdo:</strong> {{ revisaoEncontrada.conteudo }}</p>
      <p><strong>Título:</strong> {{ revisaoEncontrada.tituloTrabalho }}</p>
      <p><strong>Grupo:</strong> {{ revisaoEncontrada.nomeGrupo }}</p>
      <p><strong>Gravidade:</strong> {{ revisaoEncontrada.gravidade }}</p>
      <p><strong>Nota:</strong> {{ revisaoEncontrada.nota }}</p>
    </div>

    <!-- Filtros -->
    <div class="mb-4 flex gap-4">
      <input v-model="filtros.titulo" placeholder="Filtrar por título" class="border p-2" />
      <input v-model.number="filtros.gravidade" type="number" min="1" max="5" placeholder="Filtrar por gravidade" class="border p-2" />
    </div>

    <!-- Tabela -->
    <table class="table-auto border w-full">
      <thead class="bg-gray-200">
        <tr>
          <th class="border px-4 py-2">ID</th>
          <th class="border px-4 py-2">Conteúdo</th>
          <th class="border px-4 py-2">Título</th>
          <th class="border px-4 py-2">Grupo</th>
          <th class="border px-4 py-2">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rev in revisoesFiltradas" :key="rev.id">
          <td class="border px-4 py-2">{{ rev.id }}</td>
          <td class="border px-4 py-2">{{ rev.conteudo }}</td>
          <td class="border px-4 py-2">{{ rev.tituloTrabalho }}</td>
          <td class="border px-4 py-2">{{ rev.nomeGrupo }}</td>
          <td class="border px-4 py-2">{{ calcularEstado(rev.gravidade, rev.nota) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Formulário -->
    <h2 class="text-xl font-semibold mt-6 mb-2">Nova Revisão</h2>
    <form @submit.prevent="salvarLocal" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="form.conteudo" placeholder="Conteúdo" class="border p-2" required />
      <input v-model="form.tituloTrabalho" placeholder="Título do Trabalho" class="border p-2" required />
      <input v-model="form.nomeGrupo" placeholder="Nome do Grupo" class="border p-2" required />
      <input v-model.number="form.gravidade" type="number" placeholder="Gravidade (1-5)" class="border p-2" required />
      <input v-model.number="form.nota" type="number" placeholder="Nota (0-10)" class="border p-2" required />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded col-span-full w-fit">Salvar</button>
    </form>
    <p v-if="erro" class="text-red-500 mt-2">{{ erro }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { listarRevisoes } from '@/services/revisaoService';

interface Revisao {
  id: number;
  conteudo: string;
  tituloTrabalho: string;
  nomeGrupo: string;
  gravidade: number | null;
  nota: number | null;
}

const revisoes = ref<Revisao[]>([]);
const erro = ref('');
const filtros = ref({ titulo: '', gravidade: null });

const form = ref({
  conteudo: '',
  tituloTrabalho: '',
  nomeGrupo: '',
  gravidade: null,
  nota: null,
});

// Variáveis para consulta local por ID
const consultaId = ref<number | null>(null);
const revisaoEncontrada = computed(() => {
  if (consultaId.value === null) return null;
  return revisoes.value.find(r => r.id === consultaId.value) || null;
});

const calcularEstado = (gravidade: number | null, nota: number | null) => {
  if ((nota !== null && nota <= 3) || (gravidade !== null && gravidade >= 4)) return 'fatal';
  if ((nota !== null && nota <= 7) || (gravidade !== null && gravidade >= 3)) return 'grave';
  return 'pendente';
};

const carregar = async () => {
  revisoes.value = await listarRevisoes();
};

// Função de salvar localmente, sem backend
const salvarLocal = async () => {
  try {
    const novoId = revisoes.value.length > 0 ? Math.max(...revisoes.value.map(r => r.id)) + 1 : 1;

    const novaRevisao: Revisao = {
      id: novoId,
      conteudo: form.value.conteudo,
      tituloTrabalho: form.value.tituloTrabalho,
      nomeGrupo: form.value.nomeGrupo,
      gravidade: form.value.gravidade,
      nota: form.value.nota,
    };

    revisoes.value.push(novaRevisao);

    form.value = { conteudo: '', tituloTrabalho: '', nomeGrupo: '', gravidade: null, nota: null };
    erro.value = '';
  } catch (e) {
    erro.value = 'Erro ao salvar revisão localmente.';
  }
};

const revisoesFiltradas = computed(() => {
  return revisoes.value.filter((r) => {
    const tituloOk = !filtros.value.titulo || r.tituloTrabalho.toLowerCase().includes(filtros.value.titulo.toLowerCase());
    const gravidadeOk = filtros.value.gravidade == null || r.gravidade === filtros.value.gravidade;
    return tituloOk && gravidadeOk;
  });
});

onMounted(carregar);
</script>
