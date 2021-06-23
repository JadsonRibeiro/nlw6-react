import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";

import { database } from "../services/firebase";

import "../styles/room.scss"

type Question = {
    id: string;
    content: string;
    author: {
        name: string;
        avatar: string
    },
    isHighlighted: boolean;
    isAnswered: boolean
}

type FirebaseQuestions = Record<string, Question>;

type RoomParams = {
    id: string;
}

export function Room() {
    const params = useParams<RoomParams>();
    const roomID = params.id;

    const { user } = useAuth();
    const [newQuestion, setNewQuestion] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState("");

    async function handleCreateNewQuestion(e: FormEvent) {
        e.preventDefault();

        if(newQuestion.trim() === "") {
            return;
        }

        if(!user) {
            throw new Error("You must be logged in");
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        await database.ref(`/rooms/${roomID}/questions`).push(question);
    }

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
                    isAnswered: value.isAnswered
                }
            });

            setQuestions(parsedQuestions);
            setTitle(databaseRoom.title);
        });
    }, [roomID]);

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomID} />
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>{title}</h1>
                    { questions.length ?? <span>{questions.length} pergunta(s) </span>}
                </div>

                <form onSubmit={handleCreateNewQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={e => setNewQuestion(e.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )
}