import React, { useEffect, useState } from "react";
import { fetchStudents } from "../services/api";
import Student from "../components/student";
 

function Home() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents().then((data) => {
      if (data) setStudents(data);
    });
  }, []);
  return (
    <div>
      <h3>Alunos:</h3>
      {students.map((student) => (
        <Student
          name={student.name}
          media={student.average_overall}
          studentId={student.id}
        />
      ))}
    </div>
  );
}

export default Home;
