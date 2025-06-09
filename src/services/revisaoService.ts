import axios from 'axios';

const api = axios.create({
  baseURL: 'https://laughing-train-7xwx7qgp57jcxw54-8080.app.github.dev'
});

// Transforma os dados do back no formato que o front espera
export const listarRevisoes = async () => {
  const response = await api.get('/revisao');
  return response.data.map((r: any) => ({
    id: r.id,
    conteudo: r.comentario,
    tituloTrabalho: r.trabalho.titulo,
    nomeGrupo: r.trabalho.grupo,
    gravidade: r.gravidade,
    nota: r.trabalho.nota
  }));
};

// Envia os dados no formato que o back espera
export const cadastrarRevisao = async (revisao: any) => {
  const payload = {
    comentario: revisao.conteudo,
    gravidade: revisao.gravidade,
    trabalhoId: 1 // ⚠️ por enquanto estamos fixando o trabalho com ID 1
  };

  await api.post('/revisao', payload);
};
