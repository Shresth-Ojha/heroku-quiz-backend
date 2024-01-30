"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    questions: [
        {
            question_no: {
                type: Number,
                required: true,
            },
            question_type: {
                type: String,
                enum: ['min/max', 'match', 'input'],
                required: true
            },
            question_text: {
                type: String,
                required: true
            },
            options: [String]
        },
    ],
    answers: {
        type: Object,
        required: true
    },
    created_by: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    is_published: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});
const Quiz = mongoose_1.default.model('Quiz', quizSchema);
exports.default = Quiz;
