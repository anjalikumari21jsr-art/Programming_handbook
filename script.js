const form = document.getElementById("studentForm");

// ===============================
// LOAD ALL STUDENTS
// ===============================
async function loadStudents() {
    try {
        const response = await fetch("/api/students");
        const result = await response.json();

        displayStudents(result.data);
        updateDashboard(result.data);
    } catch (error) {
        console.error("Error loading students:", error);
    }
}


// ===============================
// DISPLAY STUDENTS
// ===============================
function displayStudents(students) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    if (students.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No students found
                </td>
            </tr>
        `;
        return;
    }

    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.rollNo}</td>

            <td>${student.name}</td>

            <td>${student.course}</td>

            <td>${student.semester}</td>

            <td>${student.email}</td>

            <td>${student.marks}</td>

            <td>
                <button
                    class="edit"
                    onclick='editStudent(${JSON.stringify(student)})'>
                    Edit
                </button>

                <button
                    class="delete"
                    onclick="deleteStudent('${student._id}')">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}


// ===============================
// CREATE / UPDATE STUDENT
// ===============================
form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const id = document.getElementById("studentId").value;

    const student = {

        name: document.getElementById("name").value,

        rollNo: document.getElementById("rollNo").value,

        course: document.getElementById("course").value,

        semester: Number(
            document.getElementById("semester").value
        ),

        email: document.getElementById("email").value,

        marks: Number(
            document.getElementById("marks").value
        )
    };

    try {

        let response;

        // UPDATE
        if (id) {

            response = await fetch(
                `/api/students/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(student)
                }
            );

        }

        // CREATE
        else {

            response = await fetch(
                "/api/students",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(student)
                }
            );
        }

        const result = await response.json();

        alert(result.message);

        if (response.ok) {

            resetForm();

            loadStudents();
        }

    } catch (error) {

        console.error("Error:", error);

        alert("Something went wrong.");
    }
});


// ===============================
// EDIT STUDENT
// ===============================
function editStudent(student) {

    document.getElementById("studentId").value =
        student._id;

    document.getElementById("name").value =
        student.name;

    document.getElementById("rollNo").value =
        student.rollNo;

    document.getElementById("course").value =
        student.course;

    document.getElementById("semester").value =
        student.semester;

    document.getElementById("email").value =
        student.email;

    document.getElementById("marks").value =
        student.marks;

    document.getElementById("formTitle").innerText =
        "Update Student";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// DELETE STUDENT
// ===============================
async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `/api/students/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        alert(result.message);

        if (response.ok) {
            loadStudents();
        }

    } catch (error) {

        console.error("Delete error:", error);

        alert("Unable to delete student.");
    }
}


// ===============================
// SEARCH STUDENTS
// ===============================
async function searchStudents() {

    const keyword =
        document.getElementById("searchInput").value.trim();

    // If search box is empty
    if (keyword === "") {

        loadStudents();

        return;
    }

    try {

        const response = await fetch(
            `/api/students/search/${encodeURIComponent(keyword)}`
        );

        const result = await response.json();

        displayStudents(result.data);

    } catch (error) {

        console.error("Search error:", error);
    }
}


// ===============================
// RESET FORM
// ===============================
function resetForm() {

    form.reset();

    document.getElementById("studentId").value = "";

    document.getElementById("formTitle").innerText =
        "Add New Student";
}


// ===============================
// DASHBOARD STATISTICS
// ===============================
function updateDashboard(students) {

    // Total students
    document.getElementById("totalStudents").innerText =
        students.length;


    // MCA students
    const mca = students.filter(
        student => student.course === "MCA"
    ).length;

    document.getElementById("mcaStudents").innerText =
        mca;


    // BCA students
    const bca = students.filter(
        student => student.course === "BCA"
    ).length;

    document.getElementById("bcaStudents").innerText =
        bca;


    // Average marks
    if (students.length > 0) {

        const totalMarks = students.reduce(
            (sum, student) =>
                sum + student.marks,
            0
        );

        const average =
            totalMarks / students.length;

        document.getElementById("averageMarks").innerText =
            average.toFixed(2);

    } else {

        document.getElementById("averageMarks").innerText =
            "0";
    }
}


// ===============================
// INITIAL LOAD
// ===============================
loadStudents();