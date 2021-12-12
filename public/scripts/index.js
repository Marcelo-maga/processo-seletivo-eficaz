

const register = document.querySelector('.cadastro')
const usersList = document.querySelector('.userList')

const registerButton = document.querySelector('#register')
const usersViewButton = document.querySelector('#users')

// Troca de componente
function toggleList() {
  register.classList.remove('hide')
  usersList.classList.add('hide')
}

function toggleRegister() {
  register.classList.add('hide')
  usersList.classList.remove('hide')
}

registerButton.addEventListener('click', () => {
  toggleList()
})

usersViewButton.addEventListener('click', () => {
  toggleRegister()
})

// mascaras para arrumar no front
const inputs = document.querySelectorAll('.input input')

const masks = {
  cep(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
  },

  telefone(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  },

  numero(value) {
    return value
      .replace(/\D/g, '')
  },

  uf(value) {
    return value
      .replace(/[^a-z]/ig, '')
      .toUpperCase()
  }
}

inputs.forEach(input => {
  const field = input.id
  input.addEventListener('input', ({ target }) => {
    target.value = masks[field](target.value)
  })
})

// Funções
const baseUrl = 'https://estagio.eficazmarketing.com/api'

const form = document.querySelector('.form-container')

// Registro
form.addEventListener('submit', (event) => {
  event.preventDefault()

  const newUser = {}

  inputs.forEach(input => {
    newUser[input.id] = input.value
  })

  try {
    fetch(`${baseUrl}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).then((response) => {
      console.log(response)
      inputs.forEach(input => {
        input.value = ""
      })
    })
  } catch (error) {
    console.log(error)
  }
})

// getUsers
async function getUsers() {
  const response = await fetch(`${baseUrl}/user`)
  const data = await response.json()
  return data
}

async function showUsersTable() {
  const users = await getUsers()

  const usersTable = document.querySelector('.tableUsers')

  users.forEach(user => {
    const userElement = document.createElement('tr')
    userElement.classList.add('userViewElement')

    const name = document.createElement('td')
    name.innerHTML = user.nome

    const email = document.createElement('td')
    email.innerHTML = user.email

    const address = document.createElement('td')
    address.innerHTML = `${user.rua}, ${user.numero} </br> ${user.bairro ? user.bairro : ''} ${user.complemento ? user.complemento : ''}</br> ${user.cep} </br>  ${user.cidade}-${user.uf}`

    const phone = document.createElement('td')
    phone.innerHTML = `${user.telefone}`

    // botoes
    const btnContainer = document.createElement('div')
    btnContainer.classList.add('btn-container')
    
    const btnEdit = document.createElement('button')
    btnEdit.innerHTML = "Alterar"
    btnEdit.classList.add("btn-edit")

    const btnDelete = document.createElement('button')
    btnDelete.innerHTML = "Deletar"
    btnDelete.classList.add('btn-delete')

    userElement.appendChild(name)
    userElement.appendChild(email)
    userElement.appendChild(address)
    userElement.appendChild(phone)

    userElement.appendChild(btnContainer)

    btnContainer.appendChild(btnEdit)
    btnContainer.appendChild(btnDelete)

    usersTable.appendChild(userElement)


    btnDelete.addEventListener("click", (event) => {
      try {
        fetch(`${baseUrl}/user/${user.id}`, {
          method: 'DELETE'
        }).then(() => {
          document.location.reload()
        })
      } catch (error) {
        console.log(error)
      }
    })

  })
}

showUsersTable()
