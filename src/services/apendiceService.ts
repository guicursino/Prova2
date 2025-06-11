import axios from 'axios';

const api = axios.create({
  baseURL: 'https://laughing-train-7xwx7qgp57jcxw54-8080.app.github.dev'
});

// Transforma os dados do back no formato que o front espera
export const listarApendices = async () => {
  const response = await api.get('/apendice');
  return response.data.map((a: any) => ({
    id: a.id,
    texto: a.texto,
    tituloTrabalho: a.trabalho.titulo,
    nomeGrupo: a.trabalho.grupo,
    data_hora: a.data_hora,
    data_hora_aprovacao: a.trabalho.data_hora_aprovacao
  }));
};

// Envia os dados no formato que o back espera
export const cadastrarApendice = async (apendice: any) => {
  const payload = {
    comentario: apendice.texto,
    gravidade: apendice.data_hora,
    trabalhoId: 1 // ⚠️ por enquanto estamos fixando o trabalho com ID 1
  };

  await api.post('/apendice', payload);
};
