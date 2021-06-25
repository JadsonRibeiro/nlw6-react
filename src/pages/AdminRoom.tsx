import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import removeImg from "../assets/images/delete.svg"
import checkImage from "../assets/images/check.svg"
import answerImg from "../assets/images/answer.svg"

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useRoom } from "../hooks/useRoom";
import { AnswerQuestionModal } from "../components/AnswerQuestionModal";
import { Header } from "../components/Header";

import { database } from "../services/firebase";

import "../styles/room.scss"

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const [questionIDModalOpened, setQuestionIDModalOpened] = useState('');

    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomID = params.id;

    const { title, questions } = useRoom(roomID);

    async function handleAnswerQuestion(questionID: string) {
        setQuestionIDModalOpened(questionID);
    }

    async function handleQuestionSubmited(roomID: string, questionID: string, answer: string) {
        await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
            answer
        });

        setQuestionIDModalOpened("");
    }

    async function handleHighlightQuestion(questionID: string) {
        await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
            isHighlighted: true
        });
    }

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
            <Header>
                <RoomCode code={roomID} />
                <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
            </Header>

            <main className="content">
                <div className="room-title">
                    <h1>{title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s) </span>}
                </div>

                <div className="questions-list">
                    {questions.map(question => (
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            answer={question.answer}
                            isHighlighted={question.isHighlighted}
                        >
                            <button 
                                className="like-button"
                                type="button"
                                aria-label="Responder pergunta"
                                onClick={() => handleAnswerQuestion(question.id)}
                            >
                                <img src={answerImg} alt="Responder pergunta" />
                            </button>
                            {!question.answer && (
                                <button 
                                    className="like-button"
                                    type="button"
                                    aria-label="Dar destaque"
                                    onClick={() => handleHighlightQuestion(question.id)}
                                >
                                    <img src={checkImage} alt="Dar destaque à pergunta" />
                                </button>
                            )}
                            <button 
                                className="like-button"
                                type="button"
                                aria-label="Marcar como gostei"
                                onClick={() => handleRemoveQuestion(question.id)}
                            >
                                <img src={removeImg} alt="Remover pergunta" />
                            </button>
                            <AnswerQuestionModal
                                answer={question.answer}
                                questionID={question.id}
                                roomID={roomID}
                                isOpen={question.id === questionIDModalOpened}
                                onQuestionAnswerd={handleQuestionSubmited}
                                onRequestClose={() => setQuestionIDModalOpened('')}
                            />
                        </Question>
                    ))}
                </div>
            </main>
        </div>
    )
}