import {test, expect, APIRequestContext} from '@playwright/test'
import {TaskModel} from './fixtures/task.model'
import {deleteTaskByHelper, postTask} from './support/helprs'

import { faker } from '@faker-js/faker';


test('deve poder cadastrar uma nova tarefa', async ({page, request}) => {
    const task: TaskModel = {
        name: "Ler um livro de TypeScript", // Deixando fixo
        // name: faker.music.songName(), // Gerando aleartório nome da música
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)

    await page.goto('http://localhost:3000/') // Acessando site

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(task.name)

    await page.click('xpath=//*[@id="root"]/div/main/div/header/form/button')

    const target = page.locator(`css=.task-item p >> text=${task.name}`)
    await expect(target).toBeVisible()
 
    await page.waitForTimeout(3000) // Tempo ficar na tela
})

test('não deve permitir tarefa duplicada', async ({page, request}) =>{
    const task: TaskModel = {
        name: "Comprar ketchup",
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)
    await postTask(request ,task)

    await page.goto('http://localhost:3000')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(task.name)
    await page.click('css=button >> text=Create')

    const target = page.locator('.swal2-html-container')
    await expect(target).toHaveText('Task already exists!')

    await page.waitForTimeout(3000) // Tempo ficar na tela
})