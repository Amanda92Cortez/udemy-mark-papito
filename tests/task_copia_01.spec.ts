import {test, expect, APIRequestContext} from '@playwright/test'
import {TaskModel} from './fixtures/task.model'
import { faker } from '@faker-js/faker';

async function deleteTaskByHelper(request: APIRequestContext, taskName: string){
    await request.delete('http://localhost:3333/helper/tasks/' + taskName)
} // Chama encapsulamento

// const taskName = 'Ler um livro de TypeScript' // Deixando fixo o texto
// const taskName = faker.music.songName();

test('deve poder cadastrar uma nova tarefa', async ({page, request}) => {
    
    const task: TaskModel = { // Deixando a interface vai ajudar colocar certo data
        name: "Ler um livro de TypeScript",
        // name: faker.music.songName(),
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)

    await page.goto('http://localhost:3000/')

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(task.name) // Utilizando texto fixo

    // Abaixo pode ter várias situações que substitui acima
    // await inputTaskName.fill(faker.music.songName()) // Gerar aleartório Nome da música
    // await page.fill('#newTask', 'Ler um livro de TypeScript') // Id
    // await page.fill('input[placeholder="Add a new Task"]', 'Ler um livro de TypeScript') // Direto descrição do campo
    // await page.fill('._listInputNewTask_1y0mp_21', 'Ler um livro de TypeScript') // Class, porém não é seguro usar desta forma
    // await page.fill('input[class*=InputNewTask]', 'Ler um livro de TypeScript') // Class, mas pegando uma parte específica
    // await inputTaskName.fill(faker.music.songName());
    
    await page.click('xpath=//*[@id="root"]/div/main/div/header/form/button') // Add
    // await page.click('css=button >> text=Create')
    
    // const target = page.getByTestId('task-item') // data-testid
    // const target = page.locator('.task-item') // classe direto
    // const target = page.locator('div[class*=listItem]') // Item class
    // const target = page.locator('css=.task-item p >> text='+taskName) // Tipo dinâmico
    // await expect(target).toHaveText(taskName) // Utiliza juntos com comandos acima

    const target = page.locator(`css=.task-item p >> text=${task.name}`) // Passando parâmetro
    await expect(target).toBeVisible() // Esse comando somente passando parâmetro
 
    await page.waitForTimeout(3000) // Tempo ficar na tela
})

test('não deve permitir tarefa duplicada', async ({page, request}) =>{
    const task: TaskModel = { // Deixando a interface vai ajudar colocar certo data
        name: "Comprar ketchup",
        is_done: false
    }

    await deleteTaskByHelper(request, task.name)
    
    const newTask = await request.post('http://localhost:3333/tasks', {data: task})
    expect(newTask.ok()).toBeTruthy()

    await page.goto('http://localhost:3000') // Site

    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(task.name)
    await page.click('css=button >> text=Create')

    const target = page.locator('.swal2-html-container')
    await expect(target).toHaveText('Task already exists!')

    await page.waitForTimeout(3000) // Tempo ficar na tela
})