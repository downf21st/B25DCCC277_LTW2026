import StudentItems from "./StudentItem";

function StudentList({ students, onDelete }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Class</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <StudentItems key={student.id} student={student} onDelete={onDelete} />
                ))}
            </tbody>
        </table>
    );
}

export default StudentList;