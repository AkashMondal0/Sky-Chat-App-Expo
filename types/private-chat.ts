import { User } from "./profile";

export interface File {
    url: string;
    type: 'image' | 'video' | 'audio' | 'file';
}

export interface PrivateMessage {
    _id?: string;
    memberDetails?: User;
    content: string;
    fileUrl?: File[];
    memberId: string;
    senderId: string;
    receiverId: string;
    conversationId: string;
    deleted: boolean;
    seenBy: [User['_id']];
    deliveredTo?: [User['_id']];
    createdAt: string | Date | any;
    updatedAt: string | Date | any;
    replyTo?: {
        _id: string;
        content: string;
        memberId: string;
        conversationId: string;
        deleted: boolean;
        replyContent: PrivateMessage;
    };
}

export interface PrivateChat {
    _id?: string;
    users?: [
        User['_id'],
    ];
    lastMessageContent: string;
    messages?: PrivateMessage[];
    updatedAt?: string | Date;
    createdAt?: string | Date;
    typing?: boolean;
    loadAllMessages?: boolean;
}

export interface PrivateMessageSeen {
    messageIds: string[];
    memberId: string;
    receiverId: string;
    conversationId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface typingState {
    conversationId: string;
    senderId: string;
    receiverId: string;
    typing: boolean;

}