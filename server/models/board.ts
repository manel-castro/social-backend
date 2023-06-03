import mongoose from "mongoose";

interface BoardAttrs {
  userId: string;
  userName: string;
  likes: number;
  postMessage: string;
}

interface BoardModel extends mongoose.Model<BoardDoc> {
  build(attrs: BoardAttrs): BoardDoc;
}

export interface BoardDoc extends mongoose.Document {
  userId: string;
  userName: string;
  likes: number;
  postMessage: string;
}

const boardSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
    postMessage: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// boardSchema.pre("save", async function (done) {
//   if (this.isModified("password")) {
//     const hashed = await Password.toHash(this.get("password"));
//     this.set("password", hashed);
//   }
//   done();
// });

boardSchema.statics.build = (attrs: BoardAttrs) => {
  return new Board(attrs);
};

const Board = mongoose.model<BoardDoc, BoardModel>("Board", boardSchema);

export { Board };
