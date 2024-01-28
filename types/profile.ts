import { CurrentTheme } from "./theme";

export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
    coverPicture?: string;
    followers?: string[];
    followings?: string[];
    privateIds?: string[];
    groupIds?: string[];
    bio?: string;
    city?: string;
    from?: string;
    updatedAt?: string;
    createdAt?: string;
    themes?: CurrentTheme[]
    status?: [
        {
            _id: string,
            url: string,
            type: 'image' | 'video' | 'audio' | "text"
            forText?: string;
            forTextBackground?: boolean;
            forTextColor?: string;
            forTextSize?: string;
            createdAt: string | Date;
        }
    ];
    online?: boolean;
}
