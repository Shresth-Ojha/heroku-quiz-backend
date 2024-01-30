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
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const error_1 = __importDefault(require("../helper/error"));
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    try {
        const name = req.body.name;
        const email = req.body.email;
        const passFromReq = req.body.password;
        const password = yield bcryptjs_1.default.hash(passFromReq, 12);
        const user = new user_1.default({ name, email, password });
        const result = yield user.save();
        if (!result) {
            resp = {
                status: 'error',
                message: 'No result found',
                data: {},
            };
            res.send(resp);
        }
        else {
            resp = {
                status: 'success',
                message: 'Registered!',
                data: { userId: result._id },
            };
            res.send(resp);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    try {
        const email = req.body.email;
        const passFromReq = req.body.password;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            const err = new error_1.default(`User with the mail ${email} doesn't exist`);
            err.statusCode = 401;
            throw err;
        }
        else {
            const passFromDB = user.password;
            const match = yield bcryptjs_1.default.compare(passFromReq, passFromDB);
            if (match) {
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, 'reallysecretkey', { expiresIn: '1h' });
                resp = {
                    status: 'success',
                    message: `Password Matched!`,
                    data: { token },
                };
                res.send(resp);
            }
            else {
                const err = new error_1.default(`Password didn't match.`);
                err.statusCode = 401;
                throw err;
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
