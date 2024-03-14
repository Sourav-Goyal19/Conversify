"use client";

import useConversation from "@/hooks/useConversation";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi2";
import { MdEmojiEmotions } from "react-icons/md";
import { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useAppSelector } from "@/redux/hooks";

const Form = () => {
  const { conversationId } = useConversation();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  window.addEventListener("click", (e) => {
    if (e.target === document.body) {
      setIsPickerVisible(false);
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setIsPickerVisible(false);
    }
  });

  window.addEventListener("scroll", (e) => {
    setIsPickerVisible(false);
  });

  window.addEventListener("resize", (e) => {
    setIsPickerVisible(false);
  });

  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key == ",") {
      setIsPickerVisible(!isPickerVisible);
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
    setValue("message", "", { shouldValidate: true });
    axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages`, {
      ...data,
      conversationId,
      sender: user?._id,
    });
    console.log(data);
  };

  return (
    <div className="p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full z-20">
      <HiPhoto size={30} className="text-sky-500 cursor-pointer" />
      <div className="relative">
        <Tippy content="Ctrl + ,">
          <div className="cursor-pointer text-sky-600 font-bold">
            <MdEmojiEmotions
              size={25}
              onClick={() => {
                setIsPickerVisible(!isPickerVisible);
              }}
            />
          </div>
        </Tippy>
        <div className="absolute bottom-10">
          {isPickerVisible && (
            <Picker
              data={data}
              onEmojiSelect={(e: any) => {
                const currentMessage = watch("message");
                const newMessage = currentMessage + e.native;
                setValue("message", newMessage, { shouldValidate: true });
                document.getElementById("message")?.focus();
              }}
              onClickOutside={() => setIsPickerVisible(false)}
              theme="light"
              icons="outline"
              previewPosition="none"
            />
          )}
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required={true}
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
