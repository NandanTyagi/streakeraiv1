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
    rowNr:
      {
        type: Number,
      },
    colNr: {
      type: Number,
    },
    comment: {
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

const Cell = models.Cell || model("Cell", CellSchema);

export default Cell;
