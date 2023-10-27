import {fileURLToPath} from 'node:url'
import {join, dirname} from 'node:path'
import {readFileSync, writeFileSync} from "node:fs"

const __dirname = dirname(fileURLToPath(import.meta.url));
const styleDir = join(__dirname, '../assets/css');
const studentData = join(__dirname, '../Data/students.json')

export const renderCallback = (res) => {
    return (err, html) => {
        if (err) throw err;
        res.writeHead(200, {
            "Content-type": "text/html"
        });
        res.end(html);
    }
}

export const assetsLoader = (url) => {
    const fileName = url.substring(1).split('/')[2];
    return readFileSync(join(styleDir, fileName), 'utf8');
}

export const getStudents = () => JSON.parse(readFileSync(studentData, 'utf8'))

export const addStudent = ({name, birthdate}) => {
    if (name.trim() !== '' && birthdate.trim() !== '') {
        const student = {name, birth: birthdate}
        const students = getStudents()
        students.push(student)
        setStudents(students)
        return true
    }
    return false;
}

const setStudents = (students) => {
    writeFileSync(studentData, JSON.stringify(students))
}

export const removeStudent = (name) => {
    const newStudents = getStudents().filter((student)=> student.name !== name)
    setStudents(newStudents)
}