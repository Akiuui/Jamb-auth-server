import mongoose from "mongoose"
import bcrypt from "bcrypt"
import pino from "pino"

const logger = pino()

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

userSchema.pre("save", async function(next){
    logger.info("Hashing the password")
    // if(this.isModified("password")) return next()
    try {
        const salt = await bcrypt.genSalt(10)

        this.password = await bcrypt.hash(this.password, salt)
        logger.info("Succesfuly hashed the password")
        return next()
    } catch (error) {
        logger.error("Exception error: ", error.msg)
        return next(error)
    }
})

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema); // 'User' is the model name

export default User