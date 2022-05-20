const btn = document.querySelector('button')

const switchView = () => {
  const caroussel = document.querySelector('.carousel')
  const list = document.querySelector('.normal')

  caroussel.classList.toggle('hide')
  list.classList.toggle('hide')
}

const enableButton = () => {
  btn.disabled = false
}

enableButton()
btn.addEventListener('click', switchView)

