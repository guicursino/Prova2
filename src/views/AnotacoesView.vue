<template>
  <div>
    <form @submit.prevent="incluir">
      <p>Texto: <input type="text" v-model="texto" required /></p>
      <p>Data/hora: <input type="datetime-local" v-model="dataHora" /></p>
      <p>Id Usuário: <input type="number" v-model="idUsuario" required /></p>
      <p>
        Usuário:
        <select v-model="idUsuario">
          <option v-for="(usuario, index) in usuarios" :key="index" :value="usuario.id">
            {{ usuario.nome }}
          </option>
        </select>
      </p>
      <button type="submit">Cadastrar</button>
    </form>
    <form @submit.prevent="pesquisar">
      <p>Texto: <input type="text" v-model="textoPesquisa" required /></p>
      <p>Nome de Usuário: <input type="text" v-model="nomeUsuarioPesquisa" required /></p>
      <button type="submit">Pesquisar</button>
    </form>
    <table v-if="anotacoes.length > 0">
      <thead>
        <tr>
          <td>Id</td>
          <td>Texto</td>
          <td>Antiguidade</td>
          <td>Usuário</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(anotacao, index) in anotacoes" :key="index">
          <td>{{ anotacao.id }}</td>
          <td>{{ anotacao.texto }}</td>
          <td>{{ monthDifference(anotacao.dataHora) }} meses</td>
          <td>{{ anotacao.usuario.nome }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Nenhum registro foi encontrado para os critérios fornecidos</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'

const texto = ref<string>('')
const dataHora = ref<Date>()
const idUsuario = ref<number>()
const erro = ref<string>('')
const textoPesquisa = ref<string>('')
const nomeUsuarioPesquisa = ref<string>()

const anotacoes = ref([{ id: 1, texto: 'blá', dataHora: '', usuario: { id: 1, nome: 'admin' } }])
const usuarios = ref([{ id: 1, nome: 'admin' }])

async function buscarUsuarios() {
  try {
    usuarios.value = (await axios.get('usuario')).data
    erro.value = ''
  } catch (e) {
    erro.value = (e as Error).message
  }
}

async function atualizar() {
  try {
    anotacoes.value = (await axios.get('anotacao')).data
    erro.value = ''
  } catch (e) {
    erro.value = (e as Error).message
  }
}

async function pesquisar() {
  try {
    anotacoes.value = (
      await axios.get('anotacao/' + nomeUsuarioPesquisa.value + '/' + textoPesquisa.value)
    ).data
    erro.value = ''
  } catch (e) {
    erro.value = (e as Error).message
  }
}

function monthDifference(startDateString: string): number {
  const startDate = new Date(startDateString)
  const endDate = new Date()
  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth()
  const endYear = endDate.getFullYear()
  const endMonth = endDate.getMonth()

  return endYear * 12 + endMonth - (startYear * 12 + startMonth)
}

async function incluir() {
  try {
    await axios.post('anotacao', {
      texto: texto.value,
      dataHora: dataHora.value,
      usuario: {
        id: idUsuario.value,
      },
    })
    erro.value = ''
    texto.value = ''
    dataHora.value = undefined
    idUsuario.value = undefined
    atualizar()
  } catch (e) {
    erro.value = (e as Error).message
  }
}

onMounted(() => {
  atualizar()
  buscarUsuarios()
})
</script>
