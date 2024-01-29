function getInput(){
    var parameter = document.getElementById('name').value;
    getAnimeList(parameter);
};

function getAnimeList(parameter){
    axios.get('/adpro/xingzhige/API/anime/?msg=' + parameter).then(function(data){
        if(data.data.code == '0'){
            var result = data.data.data;
            initTable = `
            <table id="animeListTable">
                <thead>
                    <tr>
                        <th>封面</th>
                        <th>番名</th>
                        <th>状态</th>
                        <th>年份</th>
                        <th>详情</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>`;
            document.getElementById('animeList').innerHTML = initTable;
            var eachAnimeDetails = '';
            for(var i in result){
                eachAnimeDetails += `
                <tr>
                    <td><img src="https://images.weserv.nl/?url=${result[i].image}" height="200" weight="140"></td>
                    <td>${result[i].name}</td>
                    <td>${result[i].ji}</td>
                    <td>${result[i].year}</td>
                    <td><button name='more' index=${String(i)}>详情</button></td>
                </tr>`;
            };
            var animeList = document.querySelector('tbody');
            animeList.innerHTML = eachAnimeDetails;
            animeList.addEventListener('click',function(e){
                if(e.target.getAttribute('name') == 'more'){
                    var index = String(Number(e.target.getAttribute('index')) + 1);
                    more(index);
                }
            });
        }
        else alert('没有结果呢~换部番看看吧');
    });
};

function more(index){
    window.open('./anime/more.html');
    axios.get('/adpro/xingzhige/API/anime/?msg=' + document.getElementById('name').value + '&n=' + index).then(function(data){
        if(data.data.code == '0'){
            let animeData = data.data.data;
            document.getElementById('animeImg').setAttribute('src',`https://images.weserv.nl/?url=${animeData.image}`);
            document.getElementById('animeName').innerText = animeData.name;
            document.getElementById('country').innerText = animeData.country;
            document.getElementById('year').innerText = animeData.year;
            document.getElementById('animeDesc').innerText = animeData.desc;
            document.getElementById('animeClass').innerText = animeData.class;
            let episodeList = document.getElementById('episodeList');
            for(let i in animeData.playlist){
                let episodeBtn = document.createElement('button');
                episodeBtn.setAttribute('class','btn btn1');
                episodeBtn.setAttribute('type','button');
                episodeBtn.setAttribute('textContent',animeData.playlist[i]);
                episodeBtn.setAttribute('onclick',`play(${Number(i) + 1},${index});`);
                episodeList.appendChild(episodeBtn);
            }
        }
    });
};

function play(episode, animeCode){
    let playPage = window.open('','_blank');
    axios.get(`/adpro/xingzhige/API/anime/?msg=${document.getElementById('name').value}&n=${animeCode}&nn=${episode}`).then(function(data){
        if(data.data.code == '0'){
            let animeData = data.data.data;
            playPage.location = animeData.play_url;
        }
    });
};