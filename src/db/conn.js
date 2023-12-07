import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/userRegistration')
.then( () => {
    console.log(`Connection build successfully`);
}).catch((err) => {
    console.log(`Connection Closed due to ${err}`)
});