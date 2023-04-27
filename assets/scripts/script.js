const criartarefaForm = document.querySelector('#criar-tarefa')
const tarefaInput = document.querySelector('#tarefa-input')
const criartarefaBtn = document.querySelector('.criar-tarefa-btn')

const editartarefa = document.querySelector('#editar-tarefa')
const confirmarEditartarefaBtn = document.querySelector('#confirmar-editar-tarefa-btn')
const cancelarEditartarefaBtn = document.querySelector('#cancelar-editar-tarefa-btn')
const tarefaInputAtual = document.querySelector('#tarefa-input-atual')
const tarefaInputEditar = document.querySelector('#tarefa-input-editar')

const removertarefa = document.querySelector('#remover-tarefa')
const confirmarRemovertarefaBtn = document.querySelector('#confirmar-remover-tarefa-btn')
const cancelarRemovertarefaBtn = document.querySelector('#cancelar-remover-tarefa-btn')
const removertarefaInput = document.querySelector('#remover-tarefa-input')

const pesquisarFiltroForm = document.querySelector('#pesquisar-filtro')
const pesquisarInput = document.querySelector('#pesquisar-input')
const filtroSelect = document.querySelector('#filtro-select')

const anotacoes = document.querySelector('#anotacoes')

const smallEditartarefa = document.querySelector('.small-editar-tarefa')
const smallTexto = document.querySelector('.small-texto')

const tarefaVazio = document.querySelector('.tarefa-vazio')

let tarefaDados = []

// Evento do botão de criar uma nova tarefa
criartarefaBtn.addEventListener('click', (elemento) => {
    elemento.preventDefault()

    let dataID = Date.now()
    let tarefaInputValor = tarefaInput.value

    const tarefa = document.querySelectorAll('.tarefa')

    if (tarefa.length > 0) {
        for (let i = 0; tarefa.length > i; i++) {

            let tarefaFilhoH3 = tarefa[i].querySelector('h3')

            if (tarefaInputValor === tarefaFilhoH3.innerText) {
                smallTexto.innerText = 'Essa tarefa já existe!'
                smallEditartarefa.classList.remove('ocultar')

                break

            } else if (tarefaInput.value !== '' && tarefa.length === i + 1) {
                criartarefa(tarefaInputValor, undefined, dataID)

                tarefaInput.value = ''
                tarefaInput.focus()

                if (!smallEditartarefa.classList.contains('ocultar')) {
                    smallEditartarefa.classList.add('ocultar')
                }

            } else {
                smallTexto.innerText = 'Insira um valor na tarefa!'
                smallEditartarefa.classList.remove('ocultar')
            }

            pesquisa()
            filtro()
        }
    } else if (tarefa.length === 0) {
        if (tarefaInput.value !== '') {
            criartarefa(tarefaInputValor, undefined, dataID)

            tarefaInput.value = ''
            tarefaInput.focus()

            if (!smallEditartarefa.classList.contains('ocultar')) {
                smallEditartarefa.classList.add('ocultar')
            }
        } else {
            smallTexto.innerText = 'Insira um valor na tarefa!'
            smallEditartarefa.classList.remove('ocultar')
        }
    }
})



// Função de criar uma nova tarefa
function criartarefa(tarefa, feito = false, dataID) {
    let divtarefa = document.createElement('div')
    divtarefa.classList.add('tarefa')
    divtarefa.id = dataID

    let h3Anotaca = document.createElement('h3')
    h3Anotaca.classList.add('tarefa-titulo')
    h3Anotaca.innerText = tarefa
    divtarefa.appendChild(h3Anotaca)

    let divIcons = document.createElement('div')
    divIcons.innerHTML = `
    <i class="fa-solid fa-check feito"></i>
    <i class="fa-solid fa-pen-to-square editar"></i>
    <i class="fa-solid fa-trash remover"></i>
    `
    divtarefa.appendChild(divIcons)

    anotacoes.appendChild(divtarefa)

    tarefaDados.push({
        tarefa: tarefa,
        concluido: feito,
        id: dataID
    })

    if (feito) {
        divtarefa.classList.add('concluido')
    }

    localStorage.setItem('Tarefas', JSON.stringify(tarefaDados))


    msgAnotacoesVazia()
}



// Marca como feito, edita e remove a tarefa
anotacoes.addEventListener('click', (elemento) => {
    let elementoClicado = elemento.target

    // Marca como feito
    if (elementoClicado.classList.contains('feito')) {
        let elementoClicadoPai = elementoClicado.closest('.tarefa')
        elementoClicadoPai.classList.toggle('concluido')

        const dadoFeito = tarefaDados.find((dado) => {
            return dado.id == elementoClicadoPai.id
        })

        if (dadoFeito.concluido === true) {
            dadoFeito.concluido = false
        }
        else {
            dadoFeito.concluido = true
        }

        localStorage.setItem('Tarefas', JSON.stringify(tarefaDados))

        if (!smallEditartarefa.classList.contains('ocultar')) {
            smallEditartarefa.classList.add('ocultar')
        }
    }



    // Remove a tarefa
    if (elementoClicado.classList.contains('remover')) {
        elementoRemover = elementoClicado.closest('.tarefa')
        elementoRemoverFilhoH3 = elementoRemover.querySelector('h3')

        dataID = elementoRemover.id

        removertarefaInput.value = elementoRemoverFilhoH3.innerHTML

        visualizarRemocao()
    }



    // Botão de editar tarefa
    if (elementoClicado.classList.contains('editar')) {
        let elementoClicadoPai = elementoClicado.closest('.tarefa')
        let elementoClicadoFilhoH3 = elementoClicadoPai.querySelector('h3')

        tarefaAnterior = elementoClicadoFilhoH3.innerText
        dataID = elementoClicadoPai.id

        tarefaInputAtual.value = tarefaAnterior
        tarefaInputEditar.value = tarefaAnterior

        alterarElementos()

        tarefaInputEditar.focus()
    }
})



// Abre a tela de editar tarefa
function alterarElementos() {
    criartarefaForm.classList.toggle('esconder')
    editartarefa.classList.toggle('esconder')
    pesquisarFiltroForm.classList.toggle('esconder')
    anotacoes.classList.toggle('esconder')

    if (!smallEditartarefa.classList.contains('ocultar')) {
        smallEditartarefa.classList.add('ocultar')
    }
}

// Abre a tela de remover tarefa
function visualizarRemocao() {
    removertarefa.classList.toggle('esconder')
    criartarefaForm.classList.toggle('esconder')
    pesquisarFiltroForm.classList.toggle('esconder')
    anotacoes.classList.toggle('esconder')
}



// Evento que confirma a edição de tarefa
confirmarEditartarefaBtn.addEventListener('click', (elemento) => {
    elemento.preventDefault()

    const tarefa = document.querySelectorAll('.tarefa')

    for (let i = 0; i < tarefa.length; i++) {

        const tarefaFilhoH3 = tarefa[i].querySelector('h3')

        if (tarefaInputEditar.value === tarefaAnterior) {
            smallTexto.innerText = 'Essa é a tarefa atual'
            smallEditartarefa.classList.remove('ocultar')

            break

        } else if (tarefaInputEditar.value == false) {
            smallTexto.innerText = 'Insira um valor na tarefa!'
            smallEditartarefa.classList.remove('ocultar')

            break

        } else if (tarefaInputEditar.value === tarefaFilhoH3.innerText) {
            smallTexto.innerText = 'Já existe essa tarefa!'
            smallEditartarefa.classList.remove('ocultar')

            break

        } else if (tarefaInputEditar.value && tarefaInputEditar.value !== tarefaAnterior && tarefa.length === i + 1) {
            const elementoEditar = document.getElementById(dataID)

            const tarefaH3 = elementoEditar.querySelector('h3')
            tarefaH3.innerText = tarefaInputEditar.value

            alterarElementos()

            const dadoEditar = tarefaDados.find((dado) => {
                return dado.id == dataID
            })

            dadoEditar.tarefa = tarefaInputEditar.value
            localStorage.setItem('Tarefas', JSON.stringify(tarefaDados))

            if (!smallEditartarefa.classList.contains('ocultar')) {
                smallEditartarefa.classList.add('ocultar')
            }
        }
    }
})

// Evento que cancela a edição da tarefa
cancelarEditartarefaBtn.addEventListener('click', alterarElementos)



// Evento que confirma a remoção da tarefa
confirmarRemovertarefaBtn.addEventListener('click', (elemento) => {
    elemento.preventDefault()

    elementoRemover.remove()

    const dadoRemover = tarefaDados.filter((dado) => {
        return dado.id != dataID
    })
    tarefaDados = dadoRemover

    localStorage.setItem('Tarefas', JSON.stringify(dadoRemover))

    visualizarRemocao()

    msgAnotacoesVazia()
})

// Evento que cancela a remoção da tarefa
cancelarRemovertarefaBtn.addEventListener('click', visualizarRemocao)



// Evento que carrega as anotações do localStorage quando a página for carregada
addEventListener('load', () => {
    const tarefas = JSON.parse(localStorage.getItem('Tarefas'))
    if (tarefas) {
        tarefas.map((elemento) => {
            criartarefa(elemento.tarefa, elemento.concluido, elemento.id)
        })
    }
})



// Exibe uma mensagem se nenhuma tarefa for encontrada
function msgAnotacoesVazia() {
    const tarefa = document.querySelectorAll('.tarefa')

    if (tarefa.length === 0) {
        tarefaVazio.classList.remove('esconder')
    } else {
        tarefaVazio.classList.add('esconder')
    }
}



// Barra de pesquisa das anotações
pesquisarInput.addEventListener('input', pesquisa = () => {
    const tarefa = document.querySelectorAll('.tarefa')

    if (tarefa) {

        tarefa.forEach((tarefa) => {
            const tarefaFilhoH3 = tarefa.querySelector('h3')
            const tarefaFilhoH3Texto = tarefa.querySelector('h3').innerText.toLowerCase()
            const pesquisarInputValor = pesquisarInput.value.toLowerCase()

            const selectOpcao = filtroSelect.value
            if (selectOpcao == 'concluidos') {

                if (tarefaFilhoH3Texto.includes(pesquisarInputValor)) {
                    const tarefaPai = tarefaFilhoH3.closest('.tarefa')

                    if (tarefaPai.classList.contains('concluido')) {
                        tarefaPai.style.display = 'block'
                    }

                } else {
                    const tarefaPai = tarefaFilhoH3.closest('.tarefa')
                    tarefaPai.style.display = 'none'
                }

                if (pesquisarInput.value == '') {
                    const tarefaPai = tarefaFilhoH3.closest('.tarefa')

                    if (tarefaPai.classList.contains('concluido')) {
                        tarefaPai.style.display = 'block'
                    }
                }

            } else if (selectOpcao === 'abertos') {
                if (tarefaFilhoH3Texto.includes(pesquisarInputValor)) {
                    const tarefaPai = tarefaFilhoH3.closest('.tarefa')

                    if (!tarefaPai.classList.contains('concluido')) {
                        tarefaPai.style.display = 'block'
                    }

                } else {
                    const tarefaPai = tarefaFilhoH3.closest('.tarefa')
                    tarefaPai.style.display = 'none'
                }

                if (pesquisarInput.value == '') {
                    const tarefaPai = tarefaFilhoH3.closest('.tarefa')

                    if (!tarefaPai.classList.contains('concluido')) {
                        tarefaPai.style.display = 'block'
                    }
                }

            } else {
                if (tarefaFilhoH3Texto.includes(pesquisarInputValor)) {
                    const tarefaPai = tarefaFilhoH3.closest('.tarefa')
                    tarefaPai.style.display = 'block'

                } else {
                    const tarefaPai = tarefaFilhoH3.closest('.tarefa')
                    tarefaPai.style.display = 'none'
                }

                if (pesquisarInput.value == '') {
                    const tarefaPai = tarefaFilhoH3.closest('.tarefa')
                    tarefaPai.style.display = 'block'
                }
            }
        })
    }
})



// Filtro de anotações
filtroSelect.addEventListener('change', filtro = () => {
    const tarefa = document.querySelectorAll('.tarefa')
    const selectOpcao = filtroSelect.value

    tarefa.forEach((tarefa) => {
        if (selectOpcao == 'concluidos') {

            if (tarefa.classList.contains('concluido')) {
                tarefa.style.display = 'block'
            } else {
                tarefa.style.display = 'none'
            }

            pesquisa()

        } else if (selectOpcao === 'abertos') {
            if (!tarefa.classList.contains('concluido')) {
                tarefa.style.display = 'block'
            } else {
                tarefa.style.display = 'none'
            }

            pesquisa()

        } else {
            tarefa.style.display = 'block'
            pesquisa()
        }
    })
})



// Fechar a notificação de alerta
const faXmark = document.querySelector('.fa-xmark')
faXmark.addEventListener('click', () => {
    smallEditartarefa.classList.add('ocultar')
})