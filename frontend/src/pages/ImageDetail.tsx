// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { X, ArrowRight, Heart, Image, MessageSquareText } from "lucide-react";
// import { getThreadById, likeThread, replyThread, likeReply, replyToReply } from "../services/threadService";
// import type { Thread, Reply } from "../models/Thread";
// import { useAppSelector } from "../store/hooks";
// import ReplyItem from "../components/ReplyItem";

// export default function ImageDetail() {
//   const { threadId } = useParams<{ threadId: string }>();
//   const navigate = useNavigate();
//   const authUser = useAppSelector((state) => state.auth.user);

//   const [thread, setThread] = useState<Thread | null>(null);
//   const [replies, setReplies] = useState<Reply[]>([]);
//   const [showDetail, setShowDetail] = useState(true);
//   const [replyText, setReplyText] = useState("");
//   const [replyImage, setReplyImage] = useState<File | null>(null);
//   const [isReplying, setIsReplying] = useState(false);

//   useEffect(() => {
//     if (threadId) {
//       getThreadById(threadId)
//         .then((data) => {
//           setThread(data);
//           setReplies(data.replies ?? []);
//         })
//         .catch(console.error);
//     }
//   }, [threadId]);

//   const handleThreadLike = async () => {
//     if (!thread) return;
//     try {
//       const res = await likeThread(thread.id);
//       if (res.status === "success") {
//         setThread((prev) =>
//           prev
//             ? {
//                 ...prev,
//                 likes: res.data.likes,
//                 isLiked: res.data.likedUserIds.includes(authUser?.id || ""),
//               }
//             : prev
//         );
//       }
//     } catch (err) {
//       console.error("❌ like thread:", err);
//     }
//   };

//   const handleReply = async () => {
//     if (!thread || (!replyText.trim() && !replyImage)) return;

//     const fd = new FormData();
//     fd.append("content", replyText);
//     if (replyImage) fd.append("image", replyImage);

//     try {
//       setIsReplying(true);
//       const res = await replyThread(thread.id, fd);

//       if (res.status === "success") {
//         setReplies((prev) => [res.data.reply, ...prev]);
//         setThread((prev) => (prev ? { ...prev, replies_count: res.data.replies } : prev));

//         setReplyText("");
//         setReplyImage(null);
//       }
//     } catch (err) {
//       console.error("❌ Reply error:", err);
//     } finally {
//       setIsReplying(false);
//     }
//   };

//   const handleReplyLike = async (replyId: string) => {
//     if (!thread) return;
//     try {
//       const res = await likeReply(thread.id, replyId);
//       if (res.status === "success") {
//         setReplies((prev) =>
//           prev.map((r) =>
//             r.id === replyId
//               ? {
//                   ...r,
//                   likes: res.data.likes,
//                   isLiked: res.data.likedUserIds.includes(authUser?.id || ""),
//                 }
//               : r
//           )
//         );
//       }
//     } catch (err) {
//       console.error("❌ like reply:", err);
//     }
//   };

//   const handleNestedReply = async (parentReplyId: string, content: string) => {
//     if (!thread || !content.trim()) return;

//     try {
//       const res = await replyToReply(thread.id, parentReplyId, content);

//       setReplies((prev) => prev.map((r) => (r.id === parentReplyId ? { ...r, children: [res.reply, ...(r.children ?? [])] } : r)));

//       setThread((prev) => (prev ? { ...prev, replies_count: res.replies } : prev));
//     } catch (err) {
//       console.error("❌ Nested reply error:", err);
//     }
//   };

//   if (!thread) return <div className="text-white p-6">Loading...</div>;

//   return (
//     <div className="flex bg-black text-white min-h-screen">
//       {/* Left Image */}
//       <div className="flex-1 flex items-center justify-center relative">
//         <img src={thread.image ?? undefined} alt="thread" className="max-h-screen object-contain" />

//         <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-black/60 p-2 rounded-full hover:bg-black">
//           <X size={20} />
//         </button>

//         <button onClick={() => setShowDetail(!showDetail)} className="absolute top-4 right-3 bg-black/60 p-2 rounded-full hover:bg-black">
//           <ArrowRight size={20} />
//         </button>
//       </div>

//       {/* Right Detail */}
//       {showDetail && (
//         <div className="w-[480px] border-l border-gray-800 flex flex-col">
//           <div className="flex-1 flex flex-col p-4">
//             {/* Thread user info */}
//             <div className="flex items-center gap-3 mb-2">
//               <Avatar className="w-10 h-10">
//                 <AvatarImage src={thread.user?.photo_profile || "/default-avatar.png"} />
//                 <AvatarFallback>{thread.user?.full_name?.[0] || "?"}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <div className="flex gap-1 items-center">
//                   <span className="font-semibold">{thread.user?.full_name}</span>
//                   <span className="text-gray-400">@{thread.user?.username}</span>
//                   <span className="text-gray-500">• {new Date(thread.created_at).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </div>

//             <p className="mb-4">{thread.content}</p>

//             {/* Thread actions */}
//             <div className="flex gap-6 mb-4 text-gray-400">
//               <button onClick={handleThreadLike} className="flex items-center gap-1 hover:text-red-500">
//                 <Heart size={18} className={thread.isLiked ? "fill-red-500 text-red-500" : ""} />
//                 <span>{thread.likes}</span>
//               </button>
//               <button className="flex items-center gap-1 hover:text-green-500">
//                 <MessageSquareText size={18} />
//                 <span>
//                   {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
//                 </span>
//               </button>
//             </div>

//             {/* Reply input */}
//             <div className="flex gap-2 mb-4 border-y border-gray-800 py-2">
//               <Avatar className="w-10 h-10">
//                 <AvatarImage src={authUser?.photo_profile || "/default-avatar.png"} />
//                 <AvatarFallback>{authUser?.full_name?.[0] || "U"}</AvatarFallback>
//               </Avatar>

//               <div className="flex-1 flex flex-col gap-2">
//                 <Input
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                   placeholder="Write a reply..."
//                   className="flex-1 text-white py-[7px] px-2 rounded resize-none outline-none placeholder-gray-400 border border-gray-600"
//                 />

//                 {replyImage && (
//                   <div className="relative w-fit mt-1">
//                     <img src={URL.createObjectURL(replyImage)} alt="preview" className="max-h-24 rounded-lg border border-gray-700" />
//                     <button type="button" onClick={() => setReplyImage(null)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-[4px] hover:bg-black text-[12px]">
//                       ✕
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="flex gap-2">
//                 <label className="cursor-pointer text-green-600 hover:text-green-500">
//                   <Image size={25} className="mt-[6px]" />
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0] || null;
//                       setReplyImage(file);
//                       e.target.value = "";
//                     }}
//                   />
//                 </label>

//                 <Button onClick={handleReply} disabled={isReplying || (!replyText.trim() && !replyImage)} className="bg-green-600 hover:bg-green-700">
//                   {isReplying ? "Replying..." : "Reply"}
//                 </Button>
//               </div>
//             </div>

//             {/* Replies list */}
//             <div className="flex-1 overflow-y-auto space-y-3">
//               {replies.map((r) => (
//                 <ReplyItem key={r.id} reply={r} onLike={handleReplyLike} onReply={handleNestedReply} />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ArrowRight, Heart, Image, MessageSquareText } from "lucide-react";
import { getThreadById, likeThread, replyThread, likeReply, replyToReply } from "../services/threadService";
import type { Thread, Reply } from "../models/Thread";
import { useAppSelector } from "../store/hooks";
import ReplyItem from "../components/ReplyItem";

export default function ImageDetail() {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);

  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showDetail, setShowDetail] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    if (threadId) {
      getThreadById(threadId)
        .then((data) => {
          setThread(data);
          setReplies(data.replies ?? []);
        })
        .catch(console.error);
    }
  }, [threadId]);

  const handleThreadLike = async () => {
    if (!thread) return;
    try {
      const res = await likeThread(thread.id);
      if (res.status === "success") {
        setThread((prev) =>
          prev
            ? {
                ...prev,
                likes: res.data.likes,
                isLiked: res.data.likedUserIds.includes(authUser?.id || ""),
              }
            : prev
        );
      }
    } catch (err) {
      console.error("❌ like thread:", err);
    }
  };

  const handleReply = async () => {
    if (!thread || (!replyText.trim() && !replyImage)) return;

    const fd = new FormData();
    fd.append("content", replyText);
    if (replyImage) fd.append("image", replyImage);

    try {
      setIsReplying(true);
      const res = await replyThread(thread.id, fd);

      if (res.status === "success") {
        setReplies((prev) => [res.data.reply, ...prev]);
        setThread((prev) => (prev ? { ...prev, replies_count: res.data.replies } : prev));

        setReplyText("");
        setReplyImage(null);
      }
    } catch (err) {
      console.error("❌ Reply error:", err);
    } finally {
      setIsReplying(false);
    }
  };

  const handleReplyLike = async (replyId: string) => {
    if (!thread) return;
    try {
      const res = await likeReply(thread.id, replyId);
      if (res.status === "success") {
        setReplies((prev) =>
          prev.map((r) =>
            r.id === replyId
              ? {
                  ...r,
                  likes: res.data.likes,
                  isLiked: res.data.likedUserIds.includes(authUser?.id || ""),
                }
              : r
          )
        );
      }
    } catch (err) {
      console.error("❌ like reply:", err);
    }
  };

  const handleNestedReply = async (parentReplyId: string, content: string) => {
    if (!thread || !content.trim()) return;

    try {
      const res = await replyToReply(thread.id, parentReplyId, content);

      setReplies((prev) => prev.map((r) => (r.id === parentReplyId ? { ...r, children: [res.reply, ...(r.children ?? [])] } : r)));

      setThread((prev) => (prev ? { ...prev, replies_count: res.replies } : prev));
    } catch (err) {
      console.error("❌ Nested reply error:", err);
    }
  };

  if (!thread) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="flex bg-black text-white min-h-screen overflow-hidden">
      {/* Left Image (tetap/fixed) */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <img src={thread.image ?? undefined} alt="thread" className="max-h-screen object-contain" />

        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-black/60 p-2 rounded-full hover:bg-black">
          <X size={20} />
        </button>

        <button onClick={() => setShowDetail(!showDetail)} className="absolute top-4 right-3 bg-black/60 p-2 rounded-full hover:bg-black">
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Right Detail (scrollable) */}
      {showDetail && (
        <div className="w-[480px] border-l border-gray-800 flex flex-col max-h-screen overflow-y-auto">
          <div className="flex-1 flex flex-col p-4">
            {/* Thread user info */}
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={thread.user?.photo_profile || "/default-avatar.png"} />
                <AvatarFallback>{thread.user?.full_name?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex gap-1 items-center">
                  <span className="font-semibold">{thread.user?.full_name}</span>
                  <span className="text-gray-400">@{thread.user?.username}</span>
                  <span className="text-gray-500">• {new Date(thread.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <p className="mb-4">{thread.content}</p>

            {/* Thread actions */}
            <div className="flex gap-6 mb-4 text-gray-400">
              <button onClick={handleThreadLike} className="flex items-center gap-1 hover:text-red-500">
                <Heart size={18} className={thread.isLiked ? "fill-red-500 text-red-500" : ""} />
                <span>{thread.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-green-500">
                <MessageSquareText size={18} />
                <span>
                  {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
                </span>
              </button>
            </div>

            {/* Reply input */}
            <div className="flex gap-2 mb-4 border-y border-gray-800 py-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={authUser?.photo_profile || "/default-avatar.png"} />
                <AvatarFallback>{authUser?.full_name?.[0] || "U"}</AvatarFallback>
              </Avatar>

              <div className="flex-1 flex flex-col gap-2">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 text-white py-[7px] px-2 rounded resize-none outline-none placeholder-gray-400 border border-gray-600"
                />

                {replyImage && (
                  <div className="relative w-fit mt-1">
                    <img src={URL.createObjectURL(replyImage)} alt="preview" className="max-h-24 rounded-lg border border-gray-700" />
                    <button type="button" onClick={() => setReplyImage(null)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-[4px] hover:bg-black text-[12px]">
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <label className="cursor-pointer text-green-600 hover:text-green-500">
                  <Image size={25} className="mt-[6px]" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setReplyImage(file);
                      e.target.value = "";
                    }}
                  />
                </label>

                <Button onClick={handleReply} disabled={isReplying || (!replyText.trim() && !replyImage)} className="bg-green-600 hover:bg-green-700">
                  {isReplying ? "Replying..." : "Reply"}
                </Button>
              </div>
            </div>

            {/* Replies list (scrollable bagian bawah) */}
            <div className="flex-1 overflow-y-auto space-y-3 pb-4">
              {replies.map((r) => (
                <ReplyItem key={r.id} reply={r} onLike={handleReplyLike} onReply={handleNestedReply} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
