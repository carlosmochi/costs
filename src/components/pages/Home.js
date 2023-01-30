import React from "react";
import styles from './Home.module.css'

import Linkbutton from "../layout/Linkbutton";

import savings from '../../img/savings.svg'

function Home(){
    return(
        <section className={styles.home_container}>
            <h1>Bem-Vindo ao <span>Costs</span></h1>
            <p>Comece a gerenciar os seu projetos agora mesmo</p>
            <Linkbutton to={"/newproject"} text={"Criar Projeto"}/>
            <img src={savings} alt="Costs"></img>
        </section>
    )
}

export default Home;