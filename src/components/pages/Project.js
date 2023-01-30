import React from "react"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import {parse, v4 as uuidv4} from 'uuid'


import styles from './Project.module.css'
import Loading from "../layout/Loading"
import Container from "../layout/Container"
import ProjectForm from "../project/ProjectForm"
import Message from "../layout/Message"
import ServiceForm from "../service/ServiceForm"
import ServiceCard from "../service/ServiceCard"

function Project(){
    const {id} = useParams()
    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState([])
    const [msgType, setMsgType] = useState([])
    const [services, setServices] = useState([])

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://127.0.0.1:5000/projects/${id}`,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            }
        }).then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)})
        .catch((err) => console.log(err))
        }, 300)
    }, [id])

    function createService(){
        // Last service
        const lastService = project.services[project.services.length-1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)


        // Validade if service cost exceeds budget
        if(newCost >  parseFloat(project.budget)){
            setMessage("Orçamento ultrapassado, verifique o valor do serviço")
            setMsgType('error')
            project.services.pop()
            return false
        }

        // Add service cost to project total
        project.cost = newCost

        // Update Project
        fetch(`http://127.0.0.1:5000/projects/${id}`, {
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(project)
        }).then((resp) => resp.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err))

        toggleServiceForm()
    }

    function removeService(id, cost){
        const servicesUpdated = project.services.filter((service) => service.id !== id)
        const projectUpdated = project
        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)
        
        fetch(`http://127.0.0.1:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(projectUpdated)
        }).then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage("Service removed successfully")
            setMsgType('success')
        })
        .catch((err) => console.log(err))
    }

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }

    function editPost(project){
        setMessage('')
        if(project.budget < project.cost){
            setMessage("The total cost of the project cannot surpass its budget")
            setMsgType("error")
            return false
        }

        fetch(`http://127.0.0.1:5000/projects/${id}`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(project)
        }).then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage("Project updated successfully")
            setMsgType('success')
        })
        .catch((err) => console.log(err))
    }

    return(
        <>{project.name ? 
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={msgType} message={message} />}
                    <div className={styles.container_details}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.button} onClick={toggleProjectForm} >
                            {!showProjectForm ? "Editar projeto" : "Fechar"}
                        </button>
                        {!showProjectForm 
                        ? <div className={styles.project_info}>
                            <p>
                                <span>Categories: </span> {project.category.name}
                            </p>   
                            <p>
                                <span>Total de orçamento: </span> R${project.budget}
                            </p>
                            <p>
                                <span>Total utilizado: </span> R${project.cost}
                            </p>
                        </div>
                        : <div className={styles.project_info}>
                            <ProjectForm handleSubmit={editPost} btntext="Concluir edição" projectData={project} />
                        </div>
                        }
                    </div>
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço:</h2>
                        <button className={styles.button} onClick={toggleServiceForm} >
                            {!showServiceForm ? "Adicionar serviço" : "Fechar"}
                        </button>
                        <div className={styles.project_info}>
                        {showServiceForm && <ServiceForm
                            handleSubmit={createService}
                            btnText="Adicionar Serviço"
                            projectData={project}  />}
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass="start">
                        {services.length > 0 
                        ? services.map((service) => (
                            <ServiceCard 
                                id = {service.id}
                                name = {service.name}
                                cost = {service.cost}
                                description = {service.description}
                                key = {service.id}
                                handleRemove = {removeService}/>
                        ))
                        : <p>Este projeto não possui serviços ainda</p>}
                    </Container>
                </Container>
            </div>
        : <Loading/>}</>
    )
}

export default Project