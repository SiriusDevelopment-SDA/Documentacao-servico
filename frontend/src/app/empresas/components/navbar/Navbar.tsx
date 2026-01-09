"use client";

import Link from "next/link";
import styles from "./navbar.module.scss";
import Image from 'next/image'

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <Image
                    src="/logoCoraxy1.png"
                    alt="Logo Coraxy"
                    width={100}
                    height={100}
                    className={styles.logoImg}
                />
            </div>

            <ul className={styles.menu}>
                <li>
                    <Link href="/regras">Home</Link>
                </li>
                <li>
                    <Link href="/novaregra">Nova Regra</Link>
                </li>
                <li>
                    <Link href="/regrasnegocio">Regras de negócio</Link>
                </li>
                <li>
                    <Link href="/parametros-padronizados">Parâmetros Padronizados</Link>
                </li>
                <li>
                    <Link href="/parametros/necessarios">Parâmetros Necessários</Link>
                </li>
            </ul>
        </nav>
    );
}
