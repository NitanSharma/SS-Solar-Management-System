const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();
const app = express();
const connecttoDb = require('./src/db/db')
const authRoutes = require('./src/routes/auth');
const clientRoutes = require('./src/routes/client.routes');
const taskRoutes = require('./src/routes/task.routes');

connecttoDb();
// app.use(cors({
//   origin: "https://ss-solar-management-system.vercel.app", 
//   methods: "GET,POST,PUT,DELETE",
//   credentials: true
// }));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/admin' , authRoutes);
app.use('/client' , clientRoutes);
app.use('/task' , taskRoutes);

app.get("/", (req , res) =>{
    res.send("Its wording");
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})