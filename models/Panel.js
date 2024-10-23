import { Schema, model, models } from "mongoose";

const CellSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    panelId: {
      type: Schema.Types.ObjectId,
      ref: "Panel",
    },
    rowNr: {
      type: Number,
    },
    colNr: {
      type: Number,
    },
    comment: {
      type: String,
    },
    label: {
      type: String,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    isClear: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const HistorySchema = new Schema({
  year: {
    type: String,
  },
  month: {
    type: String,
  },
  cells: [CellSchema],
});

const PanelSchema = new Schema(
  {
    goalToAchieve: {
      type: String,
      required: true,
    },
    habitsNames: [
      {
        type: String,
        required: [true, "Please provide a habit name"],
      },
    ],
    habitsValues: [
      {
        type: String,
        required: [true, "Please provide a habit value"],
      },
    ],
    days: {
      type: Number,
      required: true,
    },
    history: [HistorySchema],
    cells: [CellSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Panel = models.Panel || model("Panel", PanelSchema);

export default Panel;
