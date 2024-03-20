import mongoose from "mongoose";

const { Schema } = mongoose;


const boardSchema = new Schema({
    boardId: {
        type: String,
        required: true,
        unique: true,
    },
    goalToAchieve: {
        type: String,
        required: true,
    },
    habitsNames: {
        type: Array,
        required: true,
    },
    habitsValues: {
        type: Array,
        required: true,
    },
    days: {
        type: Number,
        required: true,
    },
    cells: {
        type: Array,
        required: true,
    }, 
    boardUser: {
        type: String,
        required: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    });

    export default mongoose.models.Board || mongoose.model("Board", boardSchema);
