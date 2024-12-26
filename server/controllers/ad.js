import * as config from "../config.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";

export const uploadImage = async (req, res) => {
  try {
    //    console.log(req.body)
    const { image } = req.body;
    const base64Image = new Buffer.from(
      image.replace(/^data:image\/\w+base64,/, ""),
      "base64"
    );
    const type = image.split(";")[0].split("/")[1];
    const params = {
      Bucket: "realist-web",
      Key: `${nanoid()}.${type}`,
      Body: base64Image,
      ACL: "public-read",
      ContentEnocding: "base64",
      contentType: `image/${type}`,
    };
    config.AWSS3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Upload failed. try again" });
  }
};

export const removeImage = async (req, res) => {
  try {
    const { Key, Bucket } = req.body;
    config.AWSS3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.send({ ok: true });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const create = async (req, res) => {
  try {
    const { photos, price, description, title, address, type, landsize } =
      req.body;
      if (!photos?.length) {
        return res.json({ error: "Photos is required" });
    }
    if (!price) {
        return res.json({ error: "Price is required" });
    }
    if (!description) {
        return res.json({ error: "Description is required" });
    }
    if (!title) {
        return res.json({ error: "Title is required" });
    }
    if (!address) {
        return res.json({ error: "Address is required" });
    }
    if (!type) {
        return res.json({ error: "Is property house or land" });
    }
    if (!landsize) {
        return res.json({ error: "Landsize is required" });
    }
     
    // const geo = await config.GOOGLE_GEOCODER.geocode(address)
    // console.log("geo==>",geo)

    // const slug = slugify(title, { lower: true });
    const ad = await new Ad({
      ...req.body,
      slug:slugify(`${type}-${address}-${price}-${nanoid(6)}`),
      postedBy: req.user_id,
    }).save();

    //make user role >>> Seller >>>>>>
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { role: "Seller" },
      },
      { new: true }
    );

    (user.password = undefined), (user.resetCode = undefined);

    return res.json({ ad, user });
  } catch (error) {
    res.json({ err: "Something went wrong.Try again" });
    console.log(error);
  }
};
