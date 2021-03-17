//16/03/2021
//JS

//init
let users

navClick()
homeItemsClick()
getUsers()

//get users
function getUsers(){
    let listUsers = JSON.parse(localStorage.getItem('users'))
    users = listUsers != undefined ? listUsers : []
}



//nav
function navClick(){
    let navItems = document.querySelectorAll('.nav-item')

    navItems.forEach(item => {
        item.addEventListener('click', el => {
            navItems.forEach(node => {
                node.classList.remove('selected')
            })
            el.currentTarget.classList.add('selected')
            document.title = el.currentTarget.getAttribute('data-title')
            
            let section = el.currentTarget.getAttribute('data-section')

            if(section == 'listUsers')
                usersList()
            if(section == 'addUser')
                validateForm('AddUserForm')

            changeSection(section)
        })
    })
}

//animations
function fadeOut(el){
    el.style.opacity = 0
    setTimeout(() => el.style.display = 'none', 600)
}

function fadeIn(el){
    el.style.display = 'block'
    setTimeout(() => el.style.opacity = 1, 100)
}

//sections
function changeSection(section){
    let fromSection = document.querySelector('div[class="section section-activated"]')
    let toSection = document.getElementById(section)
    fromSection.classList.remove('section-activated')
    toSection.classList.add('section-activated')

    fadeOut(fromSection)
    fromSection.classList.remove('section-activated')
    
    setTimeout(() => {
        toSection.classList.add('section-activated')
        fadeIn(toSection)
    }, 600)
}

//home
function homeItemsClick(){
    document.querySelector('#usersSection').addEventListener('click', () => {
        document.querySelectorAll('.nav-item')[1].click()
    })
    
    document.querySelector('#addUserSection').addEventListener('click', () => {
        document.querySelectorAll('.nav-item')[2].click()
    })
    
    document.querySelector('#settingsSection').addEventListener('click', () => {
        document.querySelectorAll('.nav-item')[3].click()
    })
}

//users
function usersList(){
    let list = document.querySelector('#list')
    list.querySelectorAll('li').forEach(n => n.remove())

    if(users != ''){
        users.forEach( user => {
            let item = document.createElement('li')
            let { name, lastname, email } = user
            let id = users.findIndex(usr => usr.email == email)
    
            item.setAttribute('data-id', id)
            item.setAttribute('data-name', name)
            item.setAttribute('data-lastname', lastname)
            item.setAttribute('data-email', email)
            item.classList.add('list-item')
    
            //create buttons
            let changeButton = document.createElement('button')
            let deleteButton = document.createElement('button')
            let optionsButtons = document.createElement('div')
            optionsButtons.classList.add('list-item-options')
    
            changeButton.innerHTML = '<i class="ri-pencil-line"></i>'
            deleteButton.innerHTML = '<i class="ri-delete-bin-7-line"></i>'
            optionsButtons.appendChild(changeButton)
            optionsButtons.appendChild(deleteButton)
    
            changeButton.addEventListener('click', () => editUser(item))
            deleteButton.addEventListener('click', () => deleteUser(item))
    
            //finish
            item.innerHTML = `<p class="list-item-title">${name} ${lastname}</p><p class="list-item-description">${email}</p>`
            item.appendChild(optionsButtons)
            list.appendChild(item)
        })
    }else{
        let item = document.createElement('li')
        
        item.classList.add('list-item-error')
        item.innerHTML = 'Sem usuários cadastrados'
        list.appendChild(item)
    }
}

//add user
function setUser(){
    let status = document.querySelector('.messageFinish')
    
    let name = document.querySelector('#name').value
    let lastname = document.querySelector('#lastname').value
    let email = document.querySelector('#email').value
    let situation
    let message
    
    let sameEmail = users.find(usr => usr.email == email)
    
    if(sameEmail === undefined){
        let user = {name, lastname, email}
        users.push(user)
        
        localStorage.setItem('users', JSON.stringify(users))
        
        usersList()

        situation = 'success'
        message = 'Usuário cadastrado com sucesso!'
    }else{
        situation = 'failure'
        message = 'E-mail já registrado!'
    }
    
    status.classList.add('messageVisible')
    status.classList.add(situation)
    status.innerHTML = message

    setTimeout(() => {
        status.classList.remove(situation, 'messageVisible')
        document.querySelector('#AddUserForm').reset()
    }, 4000)
}

//edit user page
function editUser(item){
    let email = item.getAttribute('data-email')
    let id = item.getAttribute('data-id')
    let name = item.getAttribute('data-name')
    let lastname = item.getAttribute('data-lastname')

    
    document.querySelector('#idEdit').value = id
    document.querySelector('#nameEdit').value = name
    document.querySelector('#lastnameEdit').value = lastname
    document.querySelector('#emailEdit').value = email
    
    changeSection('editUser')
    validateForm('ChangeUserForm')
    document.title = 'Editar usuário | Go'
}

//change user
function changeUser(){
    let status = document.querySelectorAll('.messageFinish')[1]
    
    let name = document.querySelector('#nameEdit').value
    let lastname = document.querySelector('#lastnameEdit').value
    let email = document.querySelector('#emailEdit').value
    let id = parseInt(document.querySelector('#idEdit').value)
    
    let sameEmail

    //verify email
    if(users[id].email == email)
        sameEmail = undefined
    else
        sameEmail = users.find(usr => usr.email == email)

    if(sameEmail === undefined){
        users[id].name = name
        users[id].lastname = lastname
        users[id].email = email
        
        localStorage.setItem('users', JSON.stringify(users))

        usersList()
        changeSection('listUsers')
        document.title = "Usuários | Go"

        document.querySelector('#ChangeUserForm').reset()
    }else{
        let situation = 'failure'
        let message = 'E-mail já registrado!'

        status.classList.add('messageVisible')
        status.classList.add(situation)
        status.innerHTML = message
    
        setTimeout(() => {
            status.classList.remove(situation, 'messageVisible')
        }, 4000)
    }
}

//delete user
function deleteUser(item){
    let i = parseInt(item.getAttribute('data-id'))

    users.splice(i, 1)
    localStorage.setItem('users', JSON.stringify(users))

    usersList()
}

//delete all users
function deleteAll(){
    users = []
    localStorage.removeItem('users');
    changeSection('home')
}

//events
document.querySelector('#AddUserForm').addEventListener('submit', event => {
    event.preventDefault()
    setUser()
})

document.querySelector('#ChangeUserForm').addEventListener('submit', event => {
    event.preventDefault()
    changeUser()
})

document.querySelector('#deleteAll').addEventListener('click', () => deleteAll())