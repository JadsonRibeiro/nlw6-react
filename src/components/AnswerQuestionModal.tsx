import { FormEvent, useState } from "react";
import ReactModal from "react-modal";

import { database } from "../services/firebase";

import "../styles/answer-question-modal.scss"

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        width: '80%',
        transform: 'translate(-50%, -50%)',
        border: '0',
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: '#fefefe',
        boxShadow: 'rgb(0 0 0 / 23%) 0px 2px 12px'
    },
}

type ModalProps = {
    answer: string;
    isOpen: boolean;
    roomID: string;
    questionID: string;
    onQuestionAnswerd: (roomID: string, questionID: string, answer: string) => void;
    onRequestClose?: () => void;
}

ReactModal.setAppElement("#root");

export function AnswerQuestionModal({ 
    answer: currentAnswer,
    isOpen, 
    questionID, 
    roomID, 
    onQuestionAnswerd, 
    onRequestClose 
}: ModalProps) {
    const [answer, setAnswer] = useState(currentAnswer ?? '');

    async function handleAnswerQuestionSubmit(event: FormEvent) {
        event.preventDefault();
        onQuestionAnswerd(roomID, questionID, answer);
    }

    return (
        <ReactModal
            isOpen={isOpen}
            style={modalStyles}
            contentLabel="Label do Modal"
            onRequestClose={onRequestClose}
        >
            <form
                onSubmit={handleAnswerQuestionSubmit}
                className="answer-form"
            >
                <textarea 
                    placeholder="Resposta" 
                    onChange={e => setAnswer(e.target.value)}
                    value={answer}
                />
                <div className="actions">
                    <button type="button" onClick={onRequestClose}>Cancelar</button>
                    <button type="submit">Responder</button>
                </div>
            </form>
        </ReactModal>
    )
}