const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/joe.db');
const objectHash = require('object-hash'); //Used to hash passwords https://www.npmjs.com/package/object-hash
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);

function hashPassword(string) {
    if (!string || string === "xxxxxxxx") {
        return null;
    }
    const hashedString = objectHash(string, { algorithm: 'RSA-SHA512' });
    return hashedString;
}

exports.createUser = async (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const { name, email, password, phone } = req.body;

    const runQuery = (query, params) => new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });

    try {
        const customer = await stripe.customers.create({
            name: name,
            email: email,
            phone: phone
        });

        const customerStripeID = customer.id

        const userId = await runQuery(`INSERT INTO users (name, email, password, phone, stripeID) VALUES (?, ?, ?, ?, ?)`, [name, email, hashPassword(password), phone, customerStripeID]);

        console.log(`A user has been inserted with id ${userId}`);

        const cookie = {
            id: userId,
            stripeID: customerStripeID,
        }

        // res.cookie("userAuth", JSON.stringify(cookie), {
        //     maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
        // })
        // res.cookie("userAuth", cookie).send(`User created successfully with id ${userId}`);
        res.status(200).cookie("userAuth", JSON.stringify(cookie), {
            maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
          }).send(`User created successfully with id ${userId}`);
    } catch (err) {
        console.error(err.message)
        return res.status(500).send(err.message);
    } finally {
        db.close();
    }
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

        //db.close();
    });
}

exports.checkUserByEmail = (req, res) => {
    const email = req.body.email; 

    const db = new sqlite3.Database(dbPath);
    db.get(`SELECT * FROM users WHERE email=?`, [email], (err, row) => {
        db.close(); // Close the database connection

        if (err) {
            res.status(500).send("Database error");
        } else if (row) {
            // User found; 1 means true. Using numbers to avoid issues when checking for ==="true" in frontend
            res.json({ exists: 1 });
        } else {
            // User not found; 2 means false
            res.json({ exists: 2 });
        }
    });
};

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.get(`SELECT * FROM users WHERE email=?`, [email], (err, row) => {
            db.close(); // Close the database connection here

            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

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
        phone: req.body.phone
    };

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

    const hashedPassword = hashPassword(req.body.password);
    if (hashedPassword) {
        updateFields.push('password = ?');
        values.push(hashedPassword);
    }
    
    if (userInfo.phone !== undefined) {
        updateFields.push('phone = ?');
        values.push(userInfo.phone);
    }

    if (updateFields.length === 0) {
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
    });

    db.close();
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    const password = hashPassword(req.body.password);
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
                db.close();
                res.status(200).send(`User deleted with id ${id}`);
            } else {
                res.status(401).send("Incorrect password")
            }
        } else {
            res.status(404).send("User not found")
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Error deleting user")
    }

}

//Functions both for middleware and endpoints
exports.getUserByCookie = async (req, res, next) => {
    
    if (!req.cookies.userAuth) {
        if (next) {
            return next('No user logged in');
        } else {
            return res.status(401).send("No user logged in");
        }
    }
    console.log("GetUserByCookie: "+req.cookies.userAuth)
    const userAuth = JSON.parse(req.cookies.userAuth);

    try {
        let user = await exports.getUser(userAuth.id);

        if (user) {
            if (next) {
                console.log("GetUserByCookie: "+user)
                // If used as middleware, add user to req and call next()
                req.user = user;
                return next();
            } else {
                // If used as endpoint, send user data
                return res.status(200).send(user);
            }
        } else {
            if (next) {
                return next('User not found');
            } else {
                return res.status(404).send("User not found");
            }
        }
    } catch (error) {
        if (next) {
            return next(error);
        } else {
            return res.status(500).send("Error getting user");
        }
    }
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = hashPassword(req.body.password);
    try {
        let user = await exports.getUserByEmail(email);

        const cookie = {
            id: user.id,
            stripeID: user.stripeID,
        }

        if(user){
            if (user.password === password){
                res.status(200).cookie("userAuth", JSON.stringify(cookie), {
                    maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
                  }).send(`User logged in with id ${user.id}`);
            } else {
                res.status(401).send("Incorrect password")
            }
        } else {
            res.status(404).send("User not found")
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Error logging in")
    }
}