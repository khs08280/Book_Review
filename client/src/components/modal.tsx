import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function Modal({ isOpen, onClose, bookId }: any) {
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };
  const { data: book, isLoading } = useQuery({
    queryKey: ["book"],
    queryFn: fetchData,
  });

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-30">
      <div className="flex items-center justify-center h-screen">
        <div
          onClick={handleModalClick}
          className="relative bg-white w-7/12 h-4/5 rounded-lg shadow-lg p-10"
        >
          <div className="absolute top-3 right-3 ">
            <button onClick={onClose}>
              <IoClose className="size-8" />
            </button>
          </div>
          <div
            className={`bg-cover bg-center`}
            style={{ backgroundImage: `url(${book.image})` }}
          >
            <div className="flex justify-between items-center z-30 ">
              <div className="flex flex-col">
                <h2 className="flex items-center text-lg font-semibold">
                  <FaStar className="mr-2" /> {book.rating}
                </h2>
                <span className="text-3xl font-semibold">{book.title}</span>
              </div>
              <img className="w-60 h-80" src={`${book.image}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
