import React from "react";

import {useNavigate} from 'react-router-dom'
import styles from './NewProject.module.css'
import ProjectForm from "../project/ProjectForm";

function NewProject(){
    const navigate = useNavigate()

    function createPost(project){

        //Initialize cost and services
        project.cost = 0
        project.services = []

        fetch('http://127.0.0.1:5000/projects', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(project),
        }).then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            //redirect
            navigate('/projects', {state:{
                message: "Projeto criado com sucesso!"
            }})
        })
        .catch((err) => console.log(err))
    }


    return(
        <div className={styles.newproject_container}>
            <h1>Crie seu Projeto</h1>
            <p>Crie um projeto para poder adicionar serviços</p>
            <ProjectForm handleSubmit={createPost} btntext="Criar Projeto" />
        </div>
    )
}

export default NewProject;