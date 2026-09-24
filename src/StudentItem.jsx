function StudentItems({ student, onDelete }) {
    const { id, name, score, className } = student;
    const isPassed = score < 5 ? "is-fail" : score >= 8 ? "is-pass" : "is-neutral";

    return (
        <tr className={isPassed}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{score}</td>
            <td>{className}</td>
            <td>
                <button type="button" onClick={() => onDelete(id)}>Xóa</button>
            </td>
        </tr>
    );
}

export default StudentItems;