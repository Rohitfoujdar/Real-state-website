import * as config from "../config.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";
import { emailTemplate } from "../helpers/email.js";

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
      slug: slugify(`${type}-${address}-${price}-${nanoid(6)}`),
      postedBy: req.user._id,
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

export const Ads = async (req, res) => {
  try {
    const adsForSell = await Ad.find({ action: "Sell" })
      .select("-location -photos.ETag -photos.Key -photos.key")
      .sort({ createdAt: -1 })
      .limit(12);

    const adsForRent = await Ad.find({ action: "Rent" })
      .select("-location -photos.ETag -photos.Key -photos.key")
      .sort({ createdAt: -1 })
      .limit(12);
    return res.status(200).json({ adsForSell, adsForRent });
  } catch (err) {
    console.log(err);
  }
};

export const read = async (req, res) => {
  try {
    const ad = await Ad.findOne({ slug: req.params.slug }).populate(
      "postedBy",
      "name username email phone company photo.Location"
    );

    const related = await Ad.find({
      _id: { $ne: ad._id },
      action: ad?.action,
      type: ad?.type,
      address: ad?.address,
    })
      .limit(3)
      .select("-photos.Key -photos.key -photos.ETag -photos.Bucket -googleMap");
    res.json({ ad, related });
  } catch (err) {
    console.log(err);
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { wishlist: req.body.adId }, // Prevent duplicate entries
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: "User not found or update failed" });
    }

    // Exclude sensitive fields
    user.password = undefined;
    user.resetCode = undefined;

    console.log("added to wishlist => ", user);

    res.json(user); // Return the updated user
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.adId },
      },
      { new: true }
    );

    const { password, resetCode, ...rest } = user._doc;
    // console.log("remove from wishlist => ", rest);

    res.json(rest);
  } catch (err) {
    console.log(err);
  }
};

export const contactSeller = async (req, res) => {
  try {
    const { name, email, adId, phone, message } = req.body;
    const ad = await Ad.findById(adId).populate("postedBy", "email");
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        enquiredProperties: adId,
      },
    });
    if (!user) {
      return res.json({ error: "Could not find user with that email" });
    } else {
      config.AWSSES.sendEmail(
        emailTemplate(
          ad.postedBy.email,
          `
           <p>You have recieved a new customer enquiry</p>
              <h4>Customer details</h4>
               <p>Name: ${name}</p>
               <p>Email: ${email}</p>
               <p>Phone: ${phone}</p>
               <p>Message: ${message}</p>

           <a href="${config.CLIENT_URL}/ad/${ad.slug}">${ad.type} in ${ad.address} for ${ad.action} ${ad.price}</a>
          `,
          email,
          "New enquiry recieve"
        ),
        (err, data) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ ok: false });
          } else {
            console.log(data);
            return res.status(200).json({ ok: true });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export const userAds = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;

    const total = await Ad.find({ postedBy: req.user._id });

    const ads = await Ad.find({ postedBy: req.user._id })
      .populate("postedBy", "name email username phone company")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json({ ads, total: total.length });
  } catch (err) {
    console.log(err);
  }
};

export const update = async (req, res) => {
  try {
    const { photos, price, type, address, description } = req.body;
    const ad = await Ad.findById(req.params._id);

    // Check ownership
    const owner = req.user._id == ad?.postedBy;
    if (!owner) {
      return res.json({ error: "Permission denied" });
    }

    // Validation
    if (!photos || !photos.length) {
      return res.json({ error: "Photos are required" });
    }
    if (!price) {
      return res.json({ error: "Price is required" });
    }
    if (!address) {
      return res.json({ error: "Address is required" });
    }
    if (!description) {
      return res.json({ error: "Description is required" });
    }
    if (!type) {
      return res.json({ error: "Is the property a house or land?" });
    }

    // Update the document
    ad.set({
      ...req.body,
      slug: ad.slug, // Preserve the original slug
    });

    await ad.save();

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const enquiredProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.enquiredProperties }).sort({
      createdAt: -1,
    });
    console.log(user.enquiredProperties);
    return res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const wishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.wishlist }).sort({ createdAt: -1 });
    return res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params._id);

    // Check ownership
    const owner = req.user._id == ad?.postedBy;
    if (!owner) {
      return res.json({ error: "Permission denied" });
    } else {
      await Ad.findByIdAndDelete(ad._id);
      return res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};
