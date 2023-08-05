const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FilesdownloadedSchema = new Schema ({
  
  URL: {type: String} ,

  usersofexpenseappId: {
    type: String,
    required: true
  } 

  },
   
  {timestamps: true} 
);

const Filesdownloaded = mongoose.model("Filesdownloaded" , FilesdownloadedSchema);
module.exports = Filesdownloaded;