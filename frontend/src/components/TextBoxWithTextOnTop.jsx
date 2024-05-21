import React from "react";

export default function TextBoxWithTextOnTop(props) {
  return (
    <div className="form-control w-full mt-4">
      <label className="label">
        <span className="label-text">{props.text}</span>
      </label>
      <label className="input input-bordered flex items-center gap-2 bg-primary">
        <input className={`w-[100%] text-black ${props.classStyle}`} {...props} />
        <div>{props.eye}</div>
      </label>
    </div>
  );
}
