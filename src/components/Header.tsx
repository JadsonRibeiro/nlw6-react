import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import menuImg from "../assets/images/menu.svg"
import logoImg from "../assets/images/logo.svg";

import "../styles/header.scss";

type HeaderProps = {
    children?: ReactNode
}


export function Header({ children }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header id="header">
            <div className={`content ${isOpen ? 'open' : ''}`}>
                <Link to="/">
                    <img 
                        src={logoImg} 
                        alt="Ilustração sobre perguntas e repostas" 
                        className="logo"
                    />
                </Link>
                <div>
                    {children}
                </div>
                <button 
                    className="mobile-menu"
                    onClick={() => setIsOpen(oldValue => !oldValue)}
                ><img src={menuImg} alt="Hamburgue menu" /></button>
            </div>
        </header>
    )
}