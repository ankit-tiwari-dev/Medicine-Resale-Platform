import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ["credit", "withdrawal"], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed"], 
      default: "pending" 
    },
    medicineId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Medicine" 
    }
  },
  {
    timestamps: true
  }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);