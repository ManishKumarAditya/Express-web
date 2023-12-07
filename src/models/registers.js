import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

// generating tokens with middleware part 
studentSchema.methods.generateAuthToken = async function() {
    try {
        console.log(this._id);

        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);

        this.tokens = this.tokens.concat({token:token}); // {token} for the Es6 by array of objects
        console.log(token);

        // save this data
        await this.save();

        return token;
    } catch (error) {
        res.send("the error part " + error);
        console.log("the error part " + error);
    }
}

// middleware part
//password hash concept of middleware
studentSchema.pre("save", async function(next) {
    console.log(`current password is ${this.password}`);

    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }

    next();
});

// now we need to create collection in database , when we write a following code then collection wes create 
const Register = new mongoose.model("Register", studentSchema);

export default Register;