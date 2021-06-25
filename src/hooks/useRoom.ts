import { useEffect, useState } from "react";

import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    content: string;
    author: {
        name: string;
        avatar: string
    },
    answer: string;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined
}

type FirebaseQuestions = Record<string, {
    id: string;
    content: string;
    author: {
        name: string;
        avatar: string
    },
    answer: string;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string
    }>
}>;

export function useRoom(roomID: string) {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<QuestionType[]>([]);

    useEffect(() => {
        const roomRef = database.ref(`/rooms/${roomID}`);
        
        roomRef.on("value", room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    answer: value.answer,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            });

            setQuestions(parsedQuestions);
            setTitle(databaseRoom.title);
        });

        return () => {
            roomRef.off("value");
        }
    }, [roomID, user?.id]);

    return {
        questions,
        title
    }
}