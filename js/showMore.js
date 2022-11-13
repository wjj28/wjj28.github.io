const button = document.querySelector('.show-more')
const rowProjectsTwo = document.querySelector('.grid2')

rowProjectsTwo.style.display = 'none';


// Ver Mais
const showMore = () => {
    if(rowProjectsTwo.style.display === 'grid') {
        rowProjectsTwo.style.display = 'none'
        button.innerHTML = 'See more projects <i class="fa-solid fa-arrow-down">'
    } else if(rowProjectsTwo.style.display === 'none') {
        rowProjectsTwo.style.display = 'grid'
        button.innerHTML = 'Show less <i class="fa-solid fa-arrow-up">'
    }
}




button.addEventListener('click', showMore)