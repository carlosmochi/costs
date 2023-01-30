import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Message from "../layout/Message";
import styles from "./Projects.module.css"
import Container from "../layout/Container.js"
import LinkButton from "../layout/Linkbutton.js"
import ProjectCard from "../project/ProjectCard";
import Loading from "../layout/Loading";


function Projects(){

    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')

    const location = useLocation()
    let message = ''
    console.log(location.state)
    if(location.state){
        message = location.state.message
    }

    useEffect(() => {
       setTimeout(() => {
        fetch('http://127.0.0.1:5000/projects/', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'    
            }
        })
        .then((resp) => resp.json())
        .then((data) => { 
            setProjects(data)
            setRemoveLoading(true)
        })
        .catch((err) => {console.log(err)})
       }, 300)
    }, [])

    function removeProject(id){
        fetch(`http://127.0.0.1:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProjects(projects.filter((project) => project.id !== id))
            setProjectMessage('projeto removido com sucesso!')
        })
        .catch((err) => {console.log(err)})
    }

    return(
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>My Projects</h1>
                <LinkButton to="/newproject" text="New Project" />
            </div>
            {message && <Message message={message} type="success" />}
            {projectMessage && <Message message={projectMessage} type="success" />}
            <Container customclass="start">
                {projects.length > 0 &&
                    projects.map((project) => (
                        <ProjectCard 
                            name={project.name}
                            id={project.id}
                            budget={project.budget} 
                            category={project.category}
                            handleRemove={removeProject}
                            key={project.id}/>
                    ))}
                {!removeLoading && <Loading />}
                {removeLoading && projects.length === 0 &&(
                    <p>Não há projetos cadastrados!</p>
                )}
            </Container>
        </div>
    )
}

export default Projects;