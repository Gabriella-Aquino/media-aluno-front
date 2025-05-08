import React, { useEffect, useState } from "react";
import "./style.css";
import { fetchStudent, fetchSubject, postScore } from "../../services/api";
import { useParams } from "react-router";

function Scores() {
  const { id } = useParams();

  const [values, setValues] = useState({});
  const [subjectSelected, setSubjectSelected] = useState();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubject().then((data) => {
      if (data) setSubjects(data);
    });

    fetchStudent(id).then((data) => {
      const initialValues = {};
    
      data.subjects.forEach((subjectData) => {
        const subject = subjects.find((sub) => sub.name === subjectData.subject);
        if (!subject) return;
      
        const subjectId = subject.id;
        initialValues[subjectId] = {};
      
        subjectData.scores.forEach((score) => {
          const term = `Bimestre ${score.term}`;
          initialValues[subjectId][term] = score.score;
        });
      });

      setValues(initialValues);
    });
    
  }, [id, subjectSelected]);

  const numInputs = 4;

  const handleValues = (subject, bimestre, value) => {
    setValues((prev) => ({
      ...prev,
      [subject]: { ...prev[subject], [bimestre]: value },
    }));
  };

  const scoreLabels = Array.from(
    { length: numInputs },
    (_, i) => `Bimestre ${i + 1}`
  );

  const handleSave = async (term) => {
    const score = Number(values[subjectSelected]?.[`Bimestre ${term}`]);

    if (isNaN(score)) {
      alert("Nota inválida :(");
      return;
    }

    if (score > 10 || score < 0){
      alert("A nota não pode ser maior que 10 nem menor que 0")
      return
    }

    const data = {
      student: Number(id),
      subject: subjectSelected,
      term, 
      score,
    };

    try {
      await postScore(data);
      alert("Nota salva com sucesso!");
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.non_field_errors) {
        alert("Essa nota já foi cadastrada para esse bimestre.");
      } else {
        alert("Erro ao salvar nota.");
      }
      console.error(error);
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
            value={values[subjectSelected]?.[label] || ""}
            onChange={(value) => handleValues(subjectSelected, label, value)}
            onSave={() => handleSave(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

function Score({ label, value, onChange, onSave }) {
  return (
    <div className="input_container">
      <label>{label}:</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onSave}>Salvar</button>
    </div>
  );
}

export default Scores;
