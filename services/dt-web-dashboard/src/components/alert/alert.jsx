import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./alert.css";

const Alert = ({ type, title, message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`py-4 lg:px-4 alert ${isVisible ? "visible" : "hidden"}`}>
      <div
        className={`${
          type === "success"
            ? "border-green-800"
            : type === "success"
            ? "border-red-800"
            : "border-orange-800"
        } p-2 border-2 items-center  leading-none lg:rounded-full flex lg:inline-flex`}
        role="alert"
      >
        <span
          className={`${
            type === "success"
              ? "bg-green-500"
              : type === "error"
              ? "bg-red-500"
              : "bg-orange-500"
          } flex rounded-full uppercase px-2 py-1 text-xs font-bold mr-3`}
        >
          {title}
        </span>
        <span className="font-semibold mr-2 text-left flex-auto">
          {message}
        </span>
        <svg
          className="fill-current opacity-75 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
        </svg>
      </div>
    </div>
  );
};

export default Alert;
