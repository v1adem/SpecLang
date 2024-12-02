enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled",
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special",
}

enum Semester {
    First = "First",
    Second = "Second",
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2,
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering",
}

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: GradeRecord[] = [];
    private nextStudentId: number = 1;
    private nextCourseId: number = 1;

    /**
     * Enrolls a new student into the university.
     * @param student - The student details, excluding the ID.
     * @returns The newly enrolled student with an assigned ID.
     */
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent = { id: this.nextStudentId++, ...student };
        this.students.push(newStudent);
        return newStudent;
    }

    /**
     * Registers a student for a course.
     * @param studentId - The ID of the student.
     * @param courseId - The ID of the course.
     * @throws Error if the student or course is not found, faculties do not match, or the course is full.
     */
    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find((s) => s.id === studentId);
        const course = this.courses.find((c) => c.id === courseId);

        if (!student || !course) {
            throw new Error("Student or Course not found.");
        }

        if (student.faculty !== course.faculty) {
            throw new Error("Student and Course belong to different faculties.");
        }

        const registeredStudents = this.grades.filter((g) => g.courseId === courseId).length;
        if (registeredStudents >= course.maxStudents) {
            throw new Error("Course has reached the maximum number of students.");
        }

        // Додаємо запис у таблицю оцінок для реєстрації студента на курс
        this.grades.push({
            studentId,
            courseId,
            grade: Grade.Unsatisfactory, // Початкова оцінка (або можна залишити порожньою)
            date: new Date(),
            semester: course.semester,
        });
    }

    /**
     * Assigns a grade to a student for a specific course.
     * @param studentId - The ID of the student.
     * @param courseId - The ID of the course.
     * @param grade - The grade to assign.
     * @throws Error if the student or course is not found or the student is not registered for the course.
     */
    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const student = this.students.find((s) => s.id === studentId);
        const course = this.courses.find((c) => c.id === courseId);

        if (!student || !course) {
            throw new Error("Student or Course not found.");
        }

        const isRegistered = this.grades.some((g) => g.studentId === studentId && g.courseId === courseId);
        if (!isRegistered) {
            throw new Error("Student is not registered for the course.");
        }

        this.grades.push({
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester,
        });
    }

    /**
     * Updates the status of a student.
     * @param studentId - The ID of the student.
     * @param newStatus - The new status to assign.
     * @throws Error if the student is not found or their status cannot be updated.
     */
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find((s) => s.id === studentId);
        if (!student) {
            throw new Error("Student not found.");
        }

        if (student.status === StudentStatus.Graduated && newStatus !== StudentStatus.Graduated) {
            throw new Error("Cannot change status of a graduated student.");
        }

        student.status = newStatus;
    }

    /**
     * Retrieves a list of students by faculty.
     * @param faculty - The faculty to filter by.
     * @returns A list of students in the specified faculty.
     */
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter((s) => s.faculty === faculty);
    }

    /**
     * Retrieves all grades for a student.
     * @param studentId - The ID of the student.
     * @returns A list of grade records for the student.
     */
    getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter((g) => g.studentId === studentId);
    }

    /**
     * Retrieves available courses for a faculty and semester.
     * @param faculty - The faculty to filter by.
     * @param semester - The semester to filter by.
     * @returns A list of available courses.
     */
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter((c) => c.faculty === faculty && c.semester === semester);
    }

    /**
     * Calculates the average grade of a student.
     * @param studentId - The ID of the student.
     * @returns The average grade, or 0 if no grades are found.
     */
    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);

        if (studentGrades.length === 0) {
            return 0;
        }

        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }

    /**
     * Retrieves a list of top students for a specific faculty.
     * @param faculty - The faculty to filter by.
     * @returns A list of top students with an average grade >= 5.
     */
    getTopStudents(faculty: Faculty): Student[] {
        const students = this.getStudentsByFaculty(faculty);

        return students.filter((student) => {
            const average = this.calculateAverageGrade(student.id);
            return average >= Grade.Excellent;
        });
    }
}

// === ДЕМОНСТРАЦІЯ ===
const ums = new UniversityManagementSystem();

// Створення студента
const student1 = ums.enrollStudent({
    fullName: "Yemelianov Vladyslav",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "PD-41",
});
console.log("New Student:", student1);

// Додавання курсу
ums["courses"].push({
    id: 1,
    name: "Algorithms",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 2,
});

// Реєстрація студента на курс
ums.registerForCourse(student1.id, 1);

// Виставлення оцінки
ums.setGrade(student1.id, 1, Grade.Excellent);

// Отримання середнього бала
console.log("Average Grade:", ums.calculateAverageGrade(student1.id));
