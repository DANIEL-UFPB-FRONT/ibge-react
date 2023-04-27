// https://servicodados.ibge.gov.br/api/v1/localidades/estados)
// https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios)


let cidadesData = null
let cidades = null

async function carregaEstados() {
    const estadosData = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    const estados = await estadosData.json()
    const selectEstados = document.getElementById('selectEstado')
    estados.forEach(estado => {
        const estadoOption = document.createElement('option')
        estadoOption.innerText = estado.nome
        estadoOption.value = estado.sigla
        selectEstados.append(estadoOption)
    });

    const estadoDefault = document.getElementById('estadoDefault')
    estadoDefault.innerText = 'Escolha seu estado'
    
}


async function selectCidadesEvent() {
    const cidadeSelecionada = document.getElementById("selectCidadesList").value;
    console.log('cidade selecionada ', cidadeSelecionada)
}
async function addCidadesList(sigla) {

    const cabecalhoCidades = document.createElement('div')
    cabecalhoCidades.id = 'selectCidade'
    cabecalhoCidades.innerHTML = '<h2>Escolha a cidade desejada'
    document.body.append(cabecalhoCidades)

    const cidadeContainer = document.createElement('div');
    cidadeContainer.id = 'cidadeContainer';

    const selectCidades = document.createElement('select');
    selectCidades.id = 'selectCidadesList'

    cidadeContainer.append(selectCidades)

    const cidadeDefault = document.createElement('option')
    cidadeDefault.id = 'cidadeDefault'
    cidadeDefault.value = 'default'
    cidadeDefault.innerText = 'Carregando cidades'
    selectCidades.append(cidadeDefault)

    document.body.append(cidadeContainer)

    cidadesData = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`)
    cidades = await cidadesData.json()
    console.log(cidades)

    cidades.forEach(cidade => {
        const cidadeOption = document.createElement('option')
        cidadeOption.innerText = cidade.nome
        cidadeOption.value = cidade.id
        selectCidades.append(cidadeOption)
    });
    cidadeDefault.innerText = 'Escolha a cidade desejada '

    document.getElementById('selectCidadesList').addEventListener('change', selectCidadesEvent)


    const searchButtom = document.createElement('input')
    searchButtom.type = 'submit'
    searchButtom.value = 'Ver mais'
    searchButtom.id = 'verMais'
    cidadeContainer.append(searchButtom)

    document.getElementById('verMais').addEventListener('click', selectCidades => {
        const cidade = document.getElementById('selectCidadesList').value
 
        let dados = document.getElementById('predata')
        if(dados === null){
            dados = document.createElement('pre')
            dados.id = 'predata'
        }
        
        if(cidade === 'default') {
            dados.innerHTML = ''
            return
        }

        const cidadeItem = cidades.find(e => e.id == cidade)

 

        dados.innerHTML = `
        Regiao: ${cidadeItem.nome}
        Microregiao: ${cidadeItem.microrregiao.nome}
        Mesoregião: ${cidadeItem.microrregiao.mesorregiao.nome}
        `

        document.body.append(dados)
    }, )
}

async function selectEstado() {

    

    const estadoSelecionado = document.getElementById("selectEstado").value;
    let selectCidadeExist = !!document.getElementById("selectCidade")
    if(selectCidadeExist) {
        document.getElementById('selectCidade').removeEventListener('change', selectCidadesEvent)
        document.getElementById("selectCidade").remove()
    }
    selectCidadeExist = !!document.getElementById('selectCidadesList')
    if(selectCidadeExist) document.getElementById("selectCidadesList").remove()

    selectCidadeExist = !!document.getElementById('verMais')
    if(selectCidadeExist) document.getElementById("verMais").remove()

    selectCidadeExist = !!document.getElementById('predata')
    if(selectCidadeExist) document.getElementById("predata").remove()
    
    if (estadoSelecionado === 'default') return

    addCidadesList(estadoSelecionado)

}

window.addEventListener('load', carregaEstados)
document.getElementById('selectEstado').addEventListener('change', selectEstado)

