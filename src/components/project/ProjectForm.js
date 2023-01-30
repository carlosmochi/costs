import React, { useEffect } from "react";

import { useState } from "react";
import Input from "../form/Input";
import Select from "../form/Select";
import Submit from "../form/Submit";
import styles from './ProjectForm.module.css'

function ProjectForm({handleSubmit, btntext, projectData}){
    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})

    useEffect(() => {
        fetch('http://127.0.0.1:5000/categories', {
        method:'GET',
        headers:{
            'Content-Type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then((data) => {setCategories(data)})
        .catch((err)=> console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    function handleChange(e){
        setProject({...project, [e.target.name]: e.target.value})
    }

    function handleCategory(e){
        setProject({...project, 
            category:{
            id: e.target.value,
            name: e.target.options[e.target.selectedIndex].text,
        }})
    }

    return(
        <form onSubmit={submit} className={styles.form}>
            <div>
                <Input 
                    type="text" 
                    text="Nome do Projeto" 
                    name="name" 
                    placeholder="Insira o nome do projeto"
                    handleOnChange={handleChange}
                    value={project.name ? project.name : ''} 
                    />
            </div>
            <div>
                <Input 
                    type="number" 
                    text="Orçamento" 
                    name="budget" 
                    placeholder="Insira o orçamento total do projeto" 
                    handleOnChange={handleChange} 
                    value={project.budget ? project.budget : ''}
                    />
            </div>
            <div>
                <Select 
                name="category_id" 
                text="Selecione uma categoria" 
                options={categories}
                handleOnChange={handleCategory} 
                value={project.category ? project.category.id : ''}/>
            </div>
            <div>
                <Submit text={btntext} />
            </div>
        </form>
    )

}

export default ProjectForm;