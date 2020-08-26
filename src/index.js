/* eslint-disable no-console */
import './app.scss';

chayns.ui.initAll();

// const url = 'https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=love&Skip=0&Take=50';

const list = fetch('https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=love&Skip=0&Take=50')
   .then(resp => resp.json())
   .then(data => getData(data.Data));

function getData(data) {
    const element = data;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 7; i++) {
        const fav = document.createElement('div');
        fav.classList.add('site');
        const $sites = document.querySelector('.sites');
        $sites.appendChild(fav);

        const pic = document.createElement('div');
        const { locationId } = element[i];
        pic.style = `background-image: url(https://sub60.tobit.com/u/${locationId}); width: 57px; height: 57px`;
        fav.appendChild(pic);

        const name = element[i].appstoreName.substring(0, 10);
        const p = document.createElement('P');
        p.innerText = name;
        fav.appendChild(p);
     }
}

const more = document.getElementById('more');

more.addEventListener('click', getData(list));

function showMore() {
   document.querySelector('.info-txt').innerHTML = 'hello';
   console.log('hello');
}
