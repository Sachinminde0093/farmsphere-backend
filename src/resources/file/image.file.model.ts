
import ImageFile from "./file.service";

const ImageFileSchema ={
    key: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    flatId: {
      type: String,
    },
    userId: {
      type: String,
    },
    size: {
      type: Number,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    meta: {
      type: Map,
      of: String,
      default: {},
    },
    module: {
      type: String,
      required: true,
    },
    type:{
        type:String,
        enum:["ProfilePhoto","FlatImage", "FlatMap"]
    }
  };
  
  
  
  // export default model<ImageFile>('file', ImageFileSchema);