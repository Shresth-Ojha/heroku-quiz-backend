"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const quiz_1 = __importDefault(require("./routes/quiz"));
const exam_1 = __importDefault(require("./routes/exam"));
const report_1 = __importDefault(require("./routes/report"));
const app = (0, express_1.default)();
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || '';
app.use(express_1.default.json());
// app.get('/', (req, res) => {
//     res.send("hey");
// })
//redirect /user requests to userRoute
app.use('/user', user_1.default);
//redirect /auth requests to authRoute
app.use('/auth', auth_1.default);
//redirect /quiz requests to quizRoute
app.use('/quiz', quiz_1.default);
//redirect /exam requests to examRoute
app.use('/exam', exam_1.default);
//redirect /report requests to reportRoute
app.use('/report', report_1.default);
app.use((err, req, res, next) => {
    let message;
    let statusCode;
    if (err.statusCode && err.statusCode < 500) {
        message = err.message;
        statusCode = err.statusCode;
    }
    else {
        message = "Something went wrong, try again after sometime.";
        statusCode = 500;
    }
    const resp = { status: "error", message, data: {} };
    if (err.data) {
        resp.data = err.data;
    }
    console.log(err.statusCode, ' -> ', err.message);
    res.status(statusCode).send(resp);
});
mongoose_1.default.connect(DB_CONNECTION_STRING);
mongoose_1.default.connection.on('connected', () => {
    console.log("DB connected");
    app.listen(process.env.PORT, () => {
        console.log('Server and DB connected');
    });
});
mongoose_1.default.connection.on('error', (error) => {
    console.log(error);
});
