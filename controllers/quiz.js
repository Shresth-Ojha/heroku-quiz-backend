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
exports.publishQuiz = exports.deleteQuiz = exports.updateQuiz = exports.getQuiz = exports.createQuiz = void 0;
const quiz_1 = __importDefault(require("../models/quiz"));
const error_1 = __importDefault(require("../helper/error"));
const createQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created_by = req.userId;
        const name = req.body.name;
        const questions = req.body.questions;
        const answers = req.body.answers;
        const quiz = new quiz_1.default({ name, questions, answers, created_by });
        const result = yield quiz.save();
        const resp = {
            status: 'success',
            message: 'quiz created succesfully',
            data: { quizId: result._id },
        };
        res.status(201).send(resp);
    }
    catch (error) {
        next(error);
    }
});
exports.createQuiz = createQuiz;
const getQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.params.quizId;
        const quiz = yield quiz_1.default.findById(quizId, {
            created_by: 0,
            is_published: 0,
        });
        if (!quiz) {
            const err = new error_1.default(`Quiz with this Id does'nt exist`);
            err.statusCode = 404;
            throw err;
        }
        const resp = {
            status: 'success',
            message: 'quiz found',
            data: quiz,
        };
        res.status(200).send(resp);
    }
    catch (error) {
        next(error);
    }
});
exports.getQuiz = getQuiz;
const updateQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const quizId = req.body._id;
        const quiz = yield quiz_1.default.findById(quizId);
        if (!quiz) {
            const err = new error_1.default(`Quiz with this Id does'nt exist`);
            err.statusCode = 404;
            throw err;
        }
        if (userId !== quiz.created_by.toString()) {
            const err = new error_1.default("You can't update other's quizzes");
            err.statusCode = 401;
            throw err;
        }
        if (quiz.is_published) {
            const err = new error_1.default("Can't update published quizes");
            err.statusCode = 405;
            throw err;
        }
        quiz.name = req.body.name;
        quiz.questions = req.body.questions;
        quiz.answers = req.body.answers;
        yield quiz.save();
        const resp = {
            status: 'success',
            message: 'quiz updated',
            data: { updatedQuiz: quiz },
        };
        res.status(200).send(resp);
    }
    catch (error) {
        next(error);
    }
});
exports.updateQuiz = updateQuiz;
const deleteQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const quizId = req.params.quizId;
        const quiz = yield quiz_1.default.findById(quizId);
        if (!quiz) {
            const err = new error_1.default(`Quiz with this Id does'nt exist`);
            err.statusCode = 404;
            throw err;
        }
        if (userId !== quiz.created_by.toString()) {
            const err = new error_1.default("You can't delete other's quizzes");
            err.statusCode = 401;
            throw err;
        }
        if (quiz.is_published) {
            const err = new error_1.default("Can't delete published quizes");
            err.statusCode = 405;
            throw err;
        }
        yield quiz_1.default.deleteOne({ _id: quizId });
        const resp = {
            status: 'success',
            message: 'quiz deleted',
            data: {},
        };
        res.status(200).send(resp);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteQuiz = deleteQuiz;
const publishQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const quizId = req.body._id;
        const quiz = yield quiz_1.default.findById(quizId);
        if (!quiz) {
            const err = new error_1.default(`Quiz with this Id does'nt exist`);
            err.statusCode = 404;
            throw err;
        }
        if (userId !== quiz.created_by.toString()) {
            const err = new error_1.default("You can't publish other's quizzes");
            err.statusCode = 401;
            throw err;
        }
        if (quiz.is_published) {
            const err = new error_1.default('Already published!');
            err.statusCode = 405;
            throw err;
        }
        quiz.is_published = true;
        yield quiz.save();
        const resp = {
            status: 'success',
            message: `quiz published! you can't update or delete it now`,
            data: {},
        };
        res.status(200).send(resp);
    }
    catch (error) {
        next(error);
    }
});
exports.publishQuiz = publishQuiz;
