import {test, expect} from '@playwright/test'
import { faker } from '@faker-js/faker';

test('deve poder cadastrar uma nova tarefa', async ({page, request}) => {
    
    const taskName = 'Ler um livro de TypeScript' // Deixando fixo o texto
    await request.delete('http://localhost:3333/helper/tasks/' + taskName) // Deletando pra facilitar automação

    await page.goto('http://localhost:3000/')

    // await page.fill('#newTask', 'Ler um livro de TypeScript') // Id
    // await page.fill('input[placeholder="Add a new Task"]', 'Ler um livro de TypeScript') // Direto descrição do campo
    // await page.fill('._listInputNewTask_1y0mp_21', 'Ler um livro de TypeScript') // Class, porém não é seguro usar desta forma
    // await page.fill('input[class*=InputNewTask]', 'Ler um livro de TypeScript') // Class, mas pegando uma parte específica
    
    // Abaixo pode ter várias situações que substitui acima
    const inputTaskName = page.locator('input[class*=InputNewTask]')
    await inputTaskName.fill(taskName) // Utilizando texto fixo na linha 6
    // await inputTaskName.fill(faker.music.songName()) // Gerar aleartório Nome da música
    
    // Add a task
    await page.click('xpath=//*[@id="root"]/div/main/div/header/form/button')
    // await page.click('css=button >> text=Create')
    
    
    await page.waitForTimeout(3000) // Tempo ficar na tela
})