"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//schema
const reportSchema = new mongoose_1.default.Schema({
    quizId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    submissions: {
        type: Object,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
//model
const Report = mongoose_1.default.model('Report', reportSchema);
exports.default = Report;
