import {createServer} from 'node:http';
import dotenv from "dotenv";
import {renderFile} from 'pug'
import {renderCallback, assetsLoader, addStudent, getStudents, removeStudent} from "./src/utils.js";
import querystring from "node:querystring";
import dayjs from 'dayjs'


dotenv.config()
const {APP_ENV, APP_LOCALHOST, APP_PORT} = process.env


createServer((req, res) => {

    const {url} = req;

    if (url === '/favicon.ico') {

        res.writeHead(200, {
            "Content-type": 'image/x-icon'
        })
        res.end()
        return
    }

    if (url.startsWith('/assets/css')) {
        res.writeHead(200, {
            "Content-type": 'text/css'
        })
        res.end(assetsLoader(url))
        return
    }

    if(url === '/') {
        const {method} = req;
        if (method === 'GET') {
            renderFile('./view/home.pug', {location: url}, renderCallback(res))
            return
        }
        if (method === 'POST') {
            let student = '';
            req.on('data', (chunk) => {
                student+=chunk;
            })
            req.on("end", () => {
                student = querystring.parse(student)
                res.writeHead(301, {
                    'Location': '/'
                })
                res.write(JSON.stringify({result: addStudent(student)}))
                res.end()
            })
            return
        }
    }
    if (url === '/users') {
        const students = getStudents().map((user) => {
            user.birth = dayjs(user.birth).format('DD MMM YYYY')
            return user
        })
        renderFile('./view/users.pug', {users: students, location: url}, renderCallback(res))
        return
    }
    if (url.startsWith("/delete")) {
        const name = url.substring(1).split('/')[1].replace('%20', ' ')
        removeStudent(name)
        res.writeHead(302, {
            "Location": "/users"
        })
        res.end()
        return
    }

    res.writeHead(404)
    res.end('Page not found')

}).listen(APP_PORT, () => {
    console.log(`Server running in ${APP_ENV}`)
    console.log(`Server running at http://${APP_LOCALHOST}:${APP_PORT}`)
})