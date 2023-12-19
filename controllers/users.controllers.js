const sqlite3 = require('sqlite3').verbose();
const { get } = require('http');
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/joe.db');
const objectHash = require('object-hash'); //Used to hash passwords https://www.npmjs.com/package/object-hash
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);

//Hashes the password using the objectHash library. The password is hashed using the RSA-SHA512 algorithm.
function hashPassword(string) {
    if (!string || string === "xxxxxxxx") {
        return null;
    }
    const hashedString = objectHash(string, { algorithm: 'RSA-SHA512' });
    return hashedString;
}

//Creates a user in the database and creates a customer in Stripe with the same information.
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

        const cookie = {
            id: userId,
            stripeID: customerStripeID,
        }
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

//Get a single user from the database from the user ID
exports.getUser = (id) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);

        db.get(`SELECT * FROM users WHERE id=?`, [id], (err, row) => {
            db.close(); 

            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

//Check if a user exists in the database from the email. Used to make sure that a user can't create multiple accounts with the same email.
//Doesn't actually return the user info, just returns true or false.
exports.checkUserByEmail = (req, res) => {
    const email = req.body.email; 

    const db = new sqlite3.Database(dbPath);
    db.get(`SELECT * FROM users WHERE email=?`, [email], (err, row) => {
        db.close();

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

//Get a single user from the database from the email
exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.get(`SELECT * FROM users WHERE email=?`, [email], (err, row) => {
            db.close(); 

            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

//Gets userinfo from the ID
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

//Used to update a user in the database. Also updates the user in Stripe with the same information.
exports.editUser = (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const userInfo = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    };

    const cookie = JSON.parse(req.cookies.userAuth);

    const id = cookie.id;
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

    const customer = stripe.customers.update(
        cookie.stripeID,
        {
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone
        }
    ).then(customer => {
        console.log(customer);
    });

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

//Used to delete a user from the database. Also deletes the user from Stripe. Not directly implemented in the website, but allows for the possibility of deleting users.
exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    const password = hashPassword(req.body.password);

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


//Used to check if a user is logged in, since the userAuth cookie is set when a user logs in.
exports.getUserByCookie = async (req, res, next) => {
    
    if (!req.cookies.userAuth) {
        if (next) {
            return next('No user logged in');
        } else {
            return res.status(401).send("No user logged in");
        }
    }
    const userAuth = JSON.parse(req.cookies.userAuth);

    try {
        let user = await exports.getUser(userAuth.id);

        if (user) {
            if (next) {
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

//Used to log a user in. Sets the userAuth cookie with the user ID and the Stripe customer ID.
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