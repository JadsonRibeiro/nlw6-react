import { useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import removeImg from "../assets/images/delete.svg"

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

import { database } from "../services/firebase";

import "../styles/room.scss"

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomID = params.id;

    const { title, questions } = useRoom(roomID);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomID}`).update({
            endedAt: new Date()
        });

        history.push('/');
    }

    async function handleRemoveQuestion(questionID: string) {
        if(window.confirm("Tem certeza que deseja remover essa pergunta?")) {
            await database.ref(`rooms/${roomID}/questions/${questionID}`).remove();
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomID} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>{title}</h1>
                    { questions.length && <span>{questions.length} pergunta(s) </span>}
                </div>

                <div className="questions-list">
                    {questions.map(question => (
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                        >
                            <button 
                                className="like-button"
                                type="button"
                                aria-label="Marcar como gostei"
                                onClick={() => handleRemoveQuestion(question.id)}
                            >
                                <img src={removeImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                    ))}
                </div>
            </main>
        </div>
    )
}