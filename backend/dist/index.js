"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
const defaultUsers_1 = require("./config/defaultUsers");
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
(0, db_1.connectDB)().then(() => {
    (async () => { await (0, defaultUsers_1.createDefaultAdmin)(); })();
    app_1.default.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
process.on('SIGINT', async () => {
    await (0, db_1.disconnectDB)();
    process.exit(0);
});
