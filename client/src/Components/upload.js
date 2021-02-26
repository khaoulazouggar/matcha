import React from "react";
import "../css/upload.css";
import { Upload } from "react-feather";

function Uploader(props) {
  const handleFile = function () {
    const content = this.result;
    props.data.setImg([content, ...props.data.img]);
    console.log("file content", content);
  };

  const onDrop = (e, file) => {
    // let data = URL.createObjectURL(picture[0]);
    // props.data.setImg([data, ...props.data.img]);
    // e.target.value = "";
    // console.log(file[0]);
    // console.log(props.data);
    let fileData = new FileReader();
    fileData.onloadend = handleFile;
    fileData.readAsDataURL(file[0]);
  };
  return (
    <div className="upload">
      <div className="file-upload">
        <div className="image-upload-wrap">
          <input
            className="file-upload-input"
            type="file"
            accept="image/*"
            onChange={(e) => onDrop(e, e.target.files)}
          />
          <div className="drag-text">
            <Upload style={{ paddingTop: "50px" }} size={40} />
            <h3> Drag And Drop At Most Five Images Here</h3>
          </div>
        </div>
        {/* {props.data.img.map((p) => (
          <img className="file-upload-image" src={p} alt={p} key={p} />
        ))}    */}
      </div>
    </div>
  );
}
export default Uploader;
