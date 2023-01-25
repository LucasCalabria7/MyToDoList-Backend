import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

                        //USERS//

//GetAllUsers
app.get("/users", async (req: Request, res: Response) => {
    try {
		const result = await db("users")
        res.status(200).send({ users: result })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//SearchUserByName
app.get("/users/:name", async (req: Request, res: Response) => {
    try {
        const q = req.params.name

		const result = await db("users").where("name", "LIKE", `%${q}%`)
        res.status(200).send({ user: result })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//CreateUSer
app.post("/users", async (req: Request, res: Response) => {
    try {
        const id = req.body.id
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        const newUser = {
            id, 
            name,
            email,
            password
        }

		await db("users").insert(newUser)
        res.status(200).send(`${name} created successfully`)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//DeleteUserById
app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id as string

        if(idToDelete !== undefined) {
            if(typeof idToDelete !== "string" ) {
                res.status(400)
                throw new Error("Invalid ID, must be a string")
            }
            if(idToDelete.length < 1 ) {
                res.status(400)
                throw new Error("Invalid ID, must have at least 2 characters")
            }
        }

        const [user] = await db("users").where({ id: idToDelete })
        if (user) {
            await db("users_tasks").del().where({ user_id: idToDelete })
            await db("users").del().where({ id: idToDelete })
        } else {
            res.status(404)
            throw new Error("ID not found, try again.")
        }

        res.status(200).send("User deleted successfully")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

                        //TASKS

//GetAllTasks
app.get("/tasks", async (req: Request, res: Response) => {
    try {
		const result = await db("tasks")
        res.status(200).send({ tasks: result })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//SearchTaskByTitle
app.get("/tasks/:title", async (req: Request, res: Response) => {
    try {
        const q = req.params.title

		const result = await db("tasks").where("title", "LIKE", `%${q}%`)
        res.status(200).send({ task: result })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//CreateTasks
app.post("/tasks", async (req: Request, res: Response) => {
    try {
        const id = req.body.id
        const title = req.body.title
        const description = req.body.description

        const newTask = {
            id, 
            title,
            description,
        }

		await db("tasks").insert(newTask)
        res.status(200).send(`${title} created successfully`)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//EditTasks
app.put("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newTitle = req.body.title
        const newDescription = req.body.description
        const newCreatedAt = req.body.createdAt
        const newStatus = req.body.status

        if(newId !== undefined) {
            if(typeof newId !== "string" ) {
                res.status(400)
                throw new Error("Invalid ID, must be a string")
            }
            if(newId.length < 1 ) {
                res.status(400)
                throw new Error("Invalid ID, must have at least 2 characters")
            }
        }
        if(newTitle !== undefined) {
            if(typeof newTitle !== "string" ) {
                res.status(400)
                throw new Error("Invalid Title, must be a string")
            }
            if(newTitle.length < 1 ) {
                res.status(400)
                throw new Error("Invalid Title, must have at least 2 characters")
            }
        }
        if(newDescription !== undefined) {
            if(typeof newDescription !== "string" ) {
                res.status(400)
                throw new Error("Invalid Description, must be a string")
            }
            if(newDescription.length < 1 ) {
                res.status(400)
                throw new Error("Invalid Description, must have at least 2 characters")
            }
        }

        if(newStatus !== undefined) {
            if(typeof newStatus !== "number" ) {
                res.status(400)
                throw new Error("Invalid Status, must be a number")
            }
        }

        const [task] = await db("tasks").where({ id: idToEdit })

        if(!task) {
            throw new Error("ID not found, please try again.")
        }

        const updatedtTask = {
            id: newId || task.id,
            title: newTitle || task.title,
            description: newDescription || task.description,
            created_at: newCreatedAt || task.created_at,
            status: newStatus || task.status
        }

		await db("tasks").update(updatedtTask).where({id: idToEdit})
        res.status(200).send(`${newTitle} updated successfully`)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//DeleteTaskById
app.delete("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        if(idToDelete !== undefined) {
            if(typeof idToDelete !== "string" ) {
                res.status(400)
                throw new Error("Invalid ID, must be a string")
            }
            if(idToDelete.length < 1 ) {
                res.status(400)
                throw new Error("Invalid ID, must have at least 2 characters")
            }
        }

        const [task] = await db("tasks").where({ id: idToDelete })
        if (task) {
            await db("users_tasks").del().where({ task_id: idToDelete })
            await db("tasks").del().where({ id: idToDelete })
        } else {
            res.status(404)
            throw new Error("ID not found, try again.")
        }

        res.status(200).send("Task deleted successfully")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


                        //USERS_TASKS

//CreateTaskForUsers
app.post("/tasks/:taskId/users/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        const taskId = req.params.taskId

        const [ task ] = await db("tasks").where({ id: taskId })

        if (!task) {
            res.status(404)
            throw new Error("'taskId' não encontrado")
        }

        const [ user ] = await db("users").where({ id: userId })

        if (!user) {
            res.status(404)
            throw new Error("'userId' não encontrado")
        }

        const newTaskForUser = {
            user_id : userId, 
            task_id : taskId,
        }

		await db("users_tasks").insert(newTaskForUser)
        res.status(200).send(`New task applied successfully`)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//DeleteUserTasks
app.delete("/tasks/:taskId/users/:userId", async (req: Request, res: Response) => {
    try {
        const userIdToDelete = req.params.userId
        const taskIdToDelete = req.params.taskId

        const [ task ] = await db("tasks").where({ id: taskIdToDelete })

        if (!task) {
            res.status(404)
            throw new Error("'taskId' não encontrado")
        }

        const [ user ] = await db("users").where({ id: userIdToDelete })

        if (!user) {
            res.status(404)
            throw new Error("'userId' não encontrado")
        }

		await db("users_tasks").del()
        .where({task_id : taskIdToDelete})
        .andWhere({user_id : userIdToDelete})
        res.status(200).send(`Task deleted from user successfully`)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//GetUsersWithTasks
app.get("/tasks/users", async (req: Request, res: Response) => {
    try {
        const result = await db("tasks")
            .select(
                "tasks.id AS taskId",
                "title",
                "description",
                "created_at AS createdAt",
                "status",
                "user_id AS userId",
                "name",
                "email",
                "password"
            )
            .leftJoin("users_tasks", "users_tasks.task_id", "=", "tasks.id")
            .leftJoin("users", "users_tasks.user_id", "=", "users.id")

        const tasks = await db("tasks")

        // const result = []

        for (let task of tasks) {
            const responsibles = []
            const users_tasks = await db("users_tasks").where({ task_id: task.id })
            
            for (let user_task of users_tasks) {
                const [ user ] = await db("users").where({ id: user_task.user_id })
                responsibles.push(user)
            }

            const newTaskWithUsers = {
                ...task,
                responsibles
            }

            result.push(newTaskWithUsers)
        }

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})