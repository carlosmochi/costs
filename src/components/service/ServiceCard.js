import React from "react"
import {BsFillTrashFill} from 'react-icons/bs'

import styles from "../project/ProjectCard.module.css"

function ServiceCard({id, name, cost, description, handleRemove}){
    const remove = (e) => {
        e.preventDefault()
        handleRemove(id, cost)
    }

    return(
        <div className={styles.project_card}>
            <h4>{name}</h4>
            <p>
                <span>Total cost: </span> {cost}
            </p>
            <p>
                <span>Description: </span> {description}
            </p>
            <div className={styles.project_card_actions}>
                <button onClick={remove}>
                    <BsFillTrashFill/> Remover
                </button>
            </div>
        </div>
    )
}

export default ServiceCard