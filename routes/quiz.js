"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_1 = require("../controllers/quiz");
const isAuth_1 = require("../middlewares/isAuth");
const router = express_1.default.Router();
//
// POST /quiz/ 
router.post('/', isAuth_1.isAuthenticated, quiz_1.createQuiz);
// GET /quiz/:quizId
router.get('/:quizId', isAuth_1.isAuthenticated, quiz_1.getQuiz);
// PUT /quiz/
router.put('/', isAuth_1.isAuthenticated, quiz_1.updateQuiz);
// DELETE /quiz/:quizId
router.delete('/:quizId', isAuth_1.isAuthenticated, quiz_1.deleteQuiz);
// PATCH /quiz/publish
router.patch('/publish', isAuth_1.isAuthenticated, quiz_1.publishQuiz);
exports.default = router;
