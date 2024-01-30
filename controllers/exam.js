"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitExam = exports.startExam = void 0;
const quiz_1 = __importDefault(require("../models/quiz"));
const report_1 = __importDefault(require("../models/report"));
const error_1 = __importDefault(require("../helper/error"));
const startExam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.params.quizId;
        const quiz = yield quiz_1.default.findById(quizId, { created_by: 0 });
        if (!quiz) {
            const err = new error_1.default(`Quiz doesn't exist`);
            err.statusCode = 404;
            throw err;
        }
        if (!quiz.is_published) {
            const err = new error_1.default(`Quiz not published yet!`);
            err.statusCode = 405;
            throw err;
        }
        res.send(quiz);
    }
    catch (error) {
        next(error);
    }
});
exports.startExam = startExam;
const submitExam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.body.quizId;
        const userId = req.userId;
        const submissions = req.body.submissions;
        const quiz = yield quiz_1.default.findById(quizId, { answers: 1 });
        if (!quiz) {
            const err = new error_1.default("Quiz does'nt exist");
            err.statusCode = 404;
            throw err;
        }
        const answers = quiz.answers;
        const keys = Object.keys(answers);
        const length = keys.length;
        let score = 0;
        const total = 10 * length;
        for (let i = 0; i < length; i++) {
            let qno = keys[i];
            const answer_list = answers[qno];
            const submission_list = submissions[qno];
            if (submission_list) {
                for (let j = 0; j < answer_list.length; j++) {
                    if (submission_list[j] === answer_list[j]) {
                        score += 10 / answer_list.length;
                    }
                }
            }
        }
        const report = new report_1.default({
            quizId,
            userId,
            submissions,
            score,
            total,
        });
        yield report.save();
        const resp = {
            status: 'success',
            message: 'Quiz submitted!',
            data: { report: report },
        };
        res.status(200).send(resp);
    }
    catch (error) {
        next(error);
    }
});
exports.submitExam = submitExam;
