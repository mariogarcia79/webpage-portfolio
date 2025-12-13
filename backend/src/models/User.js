import { Schema, model } from 'mongoose';
import { UserRole } from "../types/userRole";
const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER,
    }
}, {
    timestamps: true
});
const User = model('User', userSchema);
export default User;
