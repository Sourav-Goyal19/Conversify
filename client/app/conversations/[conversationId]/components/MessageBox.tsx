"use client";

import Avatar from "@/components/Avatar";
import ImageOpener from "@/components/ImageOpener";
import { useAppSelector } from "@/redux/hooks";
import clsx from "clsx";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";

interface MessageBoxProps {
  isLast?: Boolean;
  key?: any;
  data: any;
  replyMessage: string;
  setReplyMessage: React.Dispatch<React.SetStateAction<any>>;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  isLast,
  data,
  setReplyMessage,
}) => {
  const user = useAppSelector((state) => state.user.user);
  const isOwn = user?._id == data?.sender?._id;
  // console.log(data.replyMessage);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const seenList = (data?.seen || [])
    .filter(
      (user: any, index: any, self: any) =>
        index === self.findIndex((u: any) => u.email === user.email)
    )
    .filter((user: any) => user.email !== data?.sender?.email)
    .map((user: any) => user.name)
    .join(", ");

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  const handleDoubleClick = () => {
    document.getElementById("message")?.focus();
    if (data.image) {
      setReplyMessage({ ...data, body: "Image" });
    } else setReplyMessage(data);
  };

  return (
    <>
      <ImageOpener
        image={data?.image}
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />
      <div
        className={clsx(
          "flex gap-3 p-4 select-none w-full overflow-hidden ",
          isOwn && "justify-end"
        )}
        onDoubleClick={handleDoubleClick}
        id={data?._id}
      >
        <div className={clsx(isOwn && "order-2")}>
          <Avatar image={data?.sender?.image} />
        </div>
        <div
          className={clsx("flex flex-col gap-2 w-full", isOwn && "items-end")}
        >
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {data?.sender?.name}
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              {format(new Date(data?.createdAt), "p")}
            </div>
          </div>
          <div
            className={clsx("flex flex-col gap-1 w-full", isOwn && "items-end")}
          >
            {data?.replyMessage && (
              <a
                href={`#${data?.replyMessage?._id}`}
                className={clsx(
                  "flex bg-neutral-100 h-11 overflow-hidden max-w-[90%] dark:bg-tertiary dark:text-accent-1"
                )}
              >
                <div className="h-11 min-w-1 max-w-1 bg-blue-400"></div>
                <div className="py-1 px-2 h-full overflow-scroll select-none text-sm italic whitespace-nowrap text-ellipsis flex items-center">
                  {data.replyMessage.body}
                </div>
              </a>
            )}
            <div
              className={clsx(
                "text-sm w-fit overflow-hidden",
                isOwn
                  ? "bg-sky-500 text-white"
                  : "bg-gray-100 dark:bg-primary dark:text-accent-3",
                data?.image ? "rounded-md p-0" : "rounded-md py-2 px-3"
              )}
            >
              {data.image ? (
                <Image
                  src={data.image}
                  alt={"Image"}
                  height={288}
                  width={288}
                  onClick={handleImageClick}
                  className="object-cover cursor-pointer hover:scale-110 transition translate"
                />
              ) : (
                <div className="select-text">{data.body}</div>
              )}
            </div>
          </div>
          {isLast && isOwn && seenList.length > 0 && (
            <div className="text-xs font-light text-gray-500">
              {`Seen by ${seenList}`}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageBox;
