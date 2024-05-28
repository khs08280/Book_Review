import { formatDate } from "../hooks/checkDate";

interface CommentProps {
  comment: IComment;
  isOpenInput: boolean;
  setIsOpenInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommunityReviewItem({
  comment,
  isOpenInput,
  setIsOpenInput,
}: CommentProps) {
  return (
    <div className="mb-2 border-b-2 border-solid border-black border-opacity-5 pb-4">
      <div className="mb-4">
        <span className="mr-2">{comment.author.nickname}</span>
        <span>{formatDate(comment.createdAt)}</span>
      </div>
      <div>{comment.content}</div>
    </div>
  );
}
