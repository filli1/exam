const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/joe.db');


exports.createUser = (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const { name, email, password } = req.body;

    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A user has been inserted with id ${this.lastID}`);
        res.send(`User created successfully with id ${this.lastID}`);
    });

    db.close();
}

exports.getUser = (id) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);

        db.get(`SELECT * FROM users WHERE id=?`, [id], (err, row) => {
            db.close(); // Close the database connection here

            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

exports.getUserReq = (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const { id } = req.params;

    db.get(`SELECT * FROM users WHERE id=?`, [id], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(row);
    });

    db.close();
}

exports.editUser = (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const userInfo = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    const id = req.params.id;

    const updateFields = [];
    const values = [];

    if (userInfo.name !== undefined) {
        updateFields.push('name = ?');
        values.push(userInfo.name);
    }

    if (userInfo.email !== undefined) {
        updateFields.push('email = ?');
        values.push(userInfo.email);
    }

    if (userInfo.password !== undefined) {
        updateFields.push('password = ?');
        values.push(userInfo.password);
    }

    if (updateFields.length === 0) {
        // If no fields to update, return an error or do nothing
        res.status(400).send('No fields to update');
        db.close();
        return;
    }

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(id);

    db.run(query, values, function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send(`User updated successfully with id ${id}`);
        db.close();
    });
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    const password = req.body.password;
    console.log("Given password: " + password)

    try {
        let user = await exports.getUser(id);

        if(user){
            if (user.password === password){
                const db = new sqlite3.Database(dbPath);
                db.get(`DELETE FROM users WHERE id=?`, [id], (err, row) => {
                    if (err) {
                        return console.error(err.message);
                    }
                });
                res.status(200).send(`User deleted with id ${id}`);
            } else {
                res.status(403).send("Incorrect password")
            }
        } else {
            res.status(404).send("User not found")
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Error deleting user")
    }

}