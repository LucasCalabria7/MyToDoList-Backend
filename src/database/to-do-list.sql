-- Active: 1674653669631@@127.0.0.1@7687

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

CREATE TABLE
    tasks (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        status INTEGER DEFAULT (0) NOT NULL
    );

CREATE TABLE
    users_tasks (
        user_id TEXT NOT NULL,
        task_id TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (task_id) REFERENCES tasks (id) ON UPDATE CASCADE
    );

    DROP TABLE users_tasks;

INSERT INTO
    users (id, name, email, password)
VALUES (
        "f001",
        "John Doe",
        "john@email.com",
        "j123"
    ), (
        "f002",
        "Mary Jane",
        "mj@email.com",
        "mj123"
    );

INSERT INTO
    tasks (id, title, description)
VALUES (
        "t001",
        "Create header",
        "Create Header component following Figma design"
    ), (
        "t002",
        "Create footer",
        "Create Footer component following Figma design"
    ), (
        "t003",
        "Test website",
        "Test the website usability"
    ), (
        "t004",
        "Deploy",
        "Use Surgee or Vercel to Deploy the application"
    );

INSERT INTO
    users_tasks (user_id, task_id)
VALUES ("f001", "t001"), ("f002", "t002"), ("f001", "t003"), ("f002", "t003");

SELECT * FROM users;

SELECT * FROM tasks;

SELECT * FROM users_tasks;