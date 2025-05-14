import React, { useEffect, useState } from "react";
import "./style.css";
import {
  deleteScore,
  fetchStudent,
  fetchSubject,
  postScore,
  putScore,
} from "../../services/api";
import { useParams } from "react-router";

function Scores({ isEdit }) {
  const { id } = useParams();

  const [values, setValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [subjectSelected, setSubjectSelected] = useState();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSubjects = await fetchSubject();
      if (fetchedSubjects) setSubjects(fetchedSubjects);

      const studentData = await fetchStudent(id);
      const initialValues = {};

      studentData.subjects.forEach((subjectData) => {
        const subject = fetchedSubjects.find(
          (sub) => sub.name === subjectData.subject
        );
        if (!subject) return;

        const subjectId = subject.id;
        initialValues[subjectId] = {};

        subjectData.scores.forEach((score) => {
          const term = `Bimestre ${score.term}`;
          initialValues[subjectId][term] = {
            id: score.id,
            score: score.score,
          };
        });
      });

      setValues(initialValues);
      setInitialValues(initialValues);
    };

    fetchData();
  }, [id]);

  const numInputs = 4;

  const handleValues = (subject, bimestre, value) => {
    setValues((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [bimestre]: {
          ...prev[subject]?.[bimestre],
          score: value,
        },
      },
    }));
  };

  const scoreLabels = Array.from(
    { length: numInputs },
    (_, i) => `Bimestre ${i + 1}`
  );

  const handleSave = async (term) => {
    const score = Number(values[subjectSelected]?.[`Bimestre ${term}`].score);

    if (isNaN(score)) {
      alert("Nota inválida :(");
      return;
    }

    if (score > 10 || score < 0) {
      alert("A nota não pode ser maior que 10 nem menor que 0");
      return;
    }

    const data = {
      student: Number(id),
      subject: subjectSelected,
      term,
      score,
    };

    if (!isEdit) {
      try {
        await postScore(data);
        alert("Nota salva com sucesso!");
      } catch (error) {
        setValues(initialValues);
        if (
          error.response?.status === 400 &&
          error.response?.data?.non_field_errors
        ) {
          alert("Essa nota já foi cadastrada para esse bimestre.");
        } else {
          alert("Erro ao salvar nota.");
        }
        console.error(error);
      }
    } else {
      const scoreId = values[subjectSelected]?.[`Bimestre ${term}`]?.id;
      console.log(scoreId);
      console.log(data);
      try {
        await putScore(scoreId, data);
        alert("Nota editada com sucesso!");
      } catch (error) {
        console.error("Erro ao editar nota:", error);
        if (error.response) {
          console.error("Resposta do servidor:", error.response);
        }
        alert("Erro ao salvar nota.");
      }
    }
  };

  const handleDelete = async (term) => {
    const scoreId = values[subjectSelected]?.[`Bimestre ${term}`]?.id;

    if (!scoreId) {
      alert("Nota não encontrada para deletar.");
      return;
    }
    try {
      await deleteScore(scoreId);
      alert("Nota deletada com sucesso")

      setValues((prev) => {
        const newValues = {...prev}
        delete newValues[subjectSelected][`Bimestre ${term}`];
        return newValues;
      })
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="score_container">
      <h1>Adicionar nota</h1>

      <div className="subjects_container">
        {subjects.map((subject) => (
          <div
            className={`subject_button ${
              subject.id === subjectSelected ? "subject_button_selected" : ""
            }`}
            key={subject.id}
            onClick={() => setSubjectSelected(subject.id)}
          >
            {subject.name}
          </div>
        ))}
      </div>

      <div className="scores_content">
        {scoreLabels.map((label, index) => (
          <Score
            key={label}
            label={label}
            value={values[subjectSelected]?.[label]?.score || ""}
            onChange={(value) => handleValues(subjectSelected, label, value)}
            onSave={() => handleSave(index + 1)}
            isEdit={isEdit}
            term={index + 1}
            handleDelete={() => handleDelete(index + 1)}
          />
        ))}
      </div>
      {!subjectSelected && <span>Escolha uma materia primeiro</span>}
    </div>
  );
}

function Score({ label, value, isEdit, onChange, onSave, term, handleDelete }) {
  return (
    <div className="input_container">
      <label>{label}:</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onSave} disabled={!term}>
        {isEdit ? "Editar" : "Salvar"}
      </button>
      {isEdit && (
        <button onClick={handleDelete} disabled={!term}>
          Excluir
        </button>
      )}
    </div>
  );
}

export default Scores;
