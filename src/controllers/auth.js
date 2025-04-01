import UserSchema from "../models/User.js"
import pino from "pino"
import jwt from "jsonwebtoken"

const logger = pino()

export const Register = async (req, res) => {
    logger.info("Connected to '/register'")

    if(req.body == undefined)
        return res.status(400).json({ message: 'Body is undefined' });

    const password = req.body["password"]
    const username = req.body["username"]

    try {
        const user = new UserSchema({password, username})
        logger.info("Created the schema")
        await user.save()
        logger.info("Saved to db")
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
}

export const Login = async (req, res) => {
    logger.info("Connected to '/login'")

    const password = req.body.password
    const username = req.body.username
    
    logger.info(password)
    try {
        logger.info("Trying to find the user")
        
        const user = await UserSchema.findOne({ username: username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        logger.info("Found the user")
        logger.info(`Trying to compare the passwords`)

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        logger.info("Successfuly compared them")
    
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // IMPORTANT: use env variables.
        res.json({ token, userId: user._id});
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}