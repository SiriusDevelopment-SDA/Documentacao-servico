import styles from './styles.module.scss'
import Image from 'next/image'
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>

        <Image 
          src="/logoCoraxy1.png" 
          alt="Logo Coraxy"
          width={200}
          height={200}
          className={styles.logo}
        />

        <h1>Documentação de serviços</h1>

        <p className={styles.subtitle}>
          Escolha uma ação para continuar
        </p>

        <div className={styles.actions}>
          <Link href="/criar" className={styles.primaryBtn}>
            Criar documentação
          </Link>

          <Link href="/sistemas" className={styles.secondaryBtn}>
            Ver documentações
          </Link>

          <Link href="/regras" className={styles.secondaryBtn}>
            Regras de negócios
          </Link>
          <Link href="/documentacao" className={styles.secondaryBtn}>
            Sistemas
          </Link>
        </div>
      </div>
    </main>
  );
}
