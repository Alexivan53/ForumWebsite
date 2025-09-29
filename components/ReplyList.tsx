import React from 'react';
import { Reply, User } from '../types';
import ReplyCard from './ReplyCard';

interface ReplyListProps {
  replies: Reply[];
  currentUser: User | null;
  onCreateReply: (parentId: string, content: string) => void;
  onUpdateReply: (replyId: string, content: string) => void;
  onDeleteReply: (replyId: string) => void;
  onViewProfile: (userId: string) => void;
  postLocked: boolean;
}

const ReplyList: React.FC<ReplyListProps> = (props) => {
  return (
    <div className="pl-4">
      {props.replies.map(reply => (
        <ReplyCard key={reply.id} {...props} reply={reply} />
      ))}
    </div>
  );
};

export default ReplyList;