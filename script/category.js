function getTimeString(time) {
    const hour = parseInt(time / 3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hour ${minute} minutes ${remainingSecond} seconds ago`;
}

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("btn-category");
    for (let btn of buttons) {
        btn.classList.remove("active");
    }
}

//Load Categories
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch(err => console.log(err));
};
//Load Videos
const loadVideos = (searchTerm= "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchTerm}`)
        .then(res => res.json())
        .then(data => displayVideos(data.videos))
        .catch(err => console.log(err));
};

//Load Category based Videos
const loadCategoryVideos = (categoryId) => {
    // alert(`Category ID: ${categoryId} clicked!`);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${categoryId}`)
        .then(res => res.json())
        .then((data) => {
            removeActiveClass();


            //Active class add
            const activeBtn = document.getElementById(`btn-${categoryId}`);
            activeBtn.classList.add("active");

            displayVideos(data.category)
        })
        .catch(err => console.log(err));
}

//Load Details
const loadDetails = async(videoId) => {
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.video);

}

//Display Details
const displayDetails = (video) => {
    const detailContainer = document.getElementById('modal-content');

    // document.getElementById('showModalData').click();

    document.getElementById('customMOdal').showModal();
    detailContainer.innerHTML = `
        <img src=${video.thumbnail} class="w-full h-60 object-cover" />
        <p> ${video.description} </p>
        `
}

//Display Categories
const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById('categories');

    categories.forEach(item => {
        console.log(item);

        //create Button
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
            <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn hover:bg-blue-300 btn-category">${item.category}</button>`

        categoriesContainer.appendChild(buttonContainer);

    });
};



//Display Videos
const displayVideos = (videos) => {
    const videosContainer = document.getElementById('videos');
    videosContainer.innerHTML = "";

    if (videos.length === 0) {
        videosContainer.classList.remove('grid');
        videosContainer.innerHTML = `
          <div class="min-h-[300px] flex flex-col justify-center items-center">
            <img src="assets/Icon.png" />
            <h2 class="text-2xl text-center font-bold text-gray-700 mt-4">Oops!! Sorry, There is no content here</h2>
       `;
        return;
    } else {
        videosContainer.classList.add('grid');
    }

    videos.forEach(video => {
        // console.log(video);
        const card = document.createElement('div');
        card.classList = "card card-compact";
        card.innerHTML = ` 
    <figure class="h-[200px] relative">
    <img
      src= ${video.thumbnail}
      class="w-full h-full object-cover"
      alt="Shoes" />
      ${video.others.posted_date?.length == 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black text-white rounded p-1 ">${getTimeString(video.others.posted_date)}</span> `
            }
      
    </figure>
    <div class="px-0 py-2 flex gap-2">
        <div>
            <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture} />
        </div>
        <div>
            <h2 class="card-title text-sm font-bold">${video.title}</h2>
            <div class=" flex items-center gap-2 ">
                <p class="text-xs text-gray-500">By ${video.authors[0].profile_name} 
                </p>
                
                ${video.authors[0].verified === true ? `<img class="w-5 " src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"/>` : ""}
            </div>
            <div class="flex items-center gap-3 mt-2">
                <p class="text-xs text-gray-500">${video.others.views} views</p>
                <p onclick="loadDetails('${video.video_id}')" class=" btn btn-xs btn-error ">Details</p>
            </div>
            
        </div>
    </div>`;
        videosContainer.appendChild(card);

    });
}

document.getElementById('search-input').addEventListener('keyup', (event)=>{
    loadVideos(event.target.value);
})
loadCategories();
loadVideos();