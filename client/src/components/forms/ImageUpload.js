import React from "react";

export default function ImageUpload({ ad, setAd }) {
  const handleUpload = async (e) => {
    try {
      let files = e.target.files;
      files = [...files];
      if (files?.length) {
        console.log(files);
        setAd({ ...ad, uploading: true });
      }
    } catch (error) {
      console.log(error);
      setAd({ ...ad, uploading: false });
    }
  };

  const handleDelete = async () => {
    try {
      setAd({ ...ad, uploading: true });
    } catch (error) {
      console.log(error);
      setAd({ ...ad, uploading: false });
    }
  };

  return (
    <>
      <lable className="btn btn-secondary mb-2 mt-4">
        <input onChange={handleUpload} type="file" accept="image/*" multiple />
      </lable>
    </>
  );
}
