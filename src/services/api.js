import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/" });

export const fetchStudents = () => {
  return api
    .get("/student/")
    .then((res) => res.data)
    .catch((err) => {
      console.error("Erro ao buscar estudantes: ", err);
      return null;
    });
};

export const fetchStudent = (id) => {
  return api
    .get(`/student/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Erro ao buscar estudante", err);
      return null;
    });
};

export const fetchSubject = () => {
  return api
    .get(`/subject/`)
    .then((res) => res.data)
    .catch((err) => console.error("Erro ao buscar materias:", err));
};

export const postScore = (data) => {
  return api
    .post(`/score/`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Erro ao criar nota: ", err);
      throw err;
    });
};

export const putScore = (id, data) => {
  return api
    .put(`/score/${id}/`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error("catch Erro ao editar nota: ", err);
      throw err;
    });
};

export const deleteScore = (id) => {
  return api
    .delete(`/score/${id}/`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Erro ao deletar nota", err);
      throw err;
    });
};
