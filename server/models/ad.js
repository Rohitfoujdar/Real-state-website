import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
  {
    photos:[{}],
    price:{type:Number, maxLength:255},
    address:{type:String, maxLength:255, required:true},
    bedrooms:Number,
    bathrooms:Number,
    carparks:Number,
    landsize:String,
    location:{
        type:{
            type:String,
            enum:["point"],
            default:"point"
        },
        coordinates:{
            type:[Number],
            default:[-33.86882, 150.20929]
        }
    },
    title:{
        type:String,
        maxLength:255
    },

    slug:{
        type:String,
        lowercase:true,
        unique:true
    },

    description:{} ,
    postedBy:{type:ObjectId, ref:"User"},
    sold:{type:Boolean, default:false},
    googleMap:{},
    type:{
        type:String,
        default:"Other"
    },
    action:{
        type:String,
        default:"Sell"
    },
    views:{
        type:Number,
        default:"0"
    }
  },
  { timestamps: true }
);

const Auth = mongoose.model("Ad", Schema);
export default Auth;
