'use strict';

var ul,
    liItems,
    imageNumber,
    imageWidth,
    prev, next,
    currentPostion = 0,
    currentImage = 0;

function init(){
    ul = document.getElementById('image_slider');
    liItems = ul.children;
    imageNumber = liItems.length;
    imageWidth = liItems[0].children[0].clientWidth;
    prev = document.querySelector(".prev");
    next = document.querySelector(".next");
    generatePager(imageNumber);
    prev.onclick = function(){ onClickPrev();};
    next.onclick = function(){ onClickNext();};
}

function animate(opts){
    let start = new Date;
    let id = setInterval(function(){
        let timePassed = new Date - start;
        let progress = timePassed / opts.duration;
        if (progress > 1){
            progress = 1;
        }
        let delta = opts.delta(progress);
        opts.step(delta);
        if (progress == 1){
            clearInterval(id);
            opts.callback();
        }
    }, opts.delay || 17);
}

function slideTo(imageToGo){
    let direction;
    let numOfImageToGo = Math.abs(imageToGo - currentImage);

    direction = currentImage > imageToGo ? 1 : -1;
    currentPostion = -1 * currentImage * imageWidth ;
    let opts = {
        duration:1000,
        delta:function(p){return p;},
        step:function(delta){
            ul.style.left = parseInt(currentPostion + direction * delta * imageWidth * numOfImageToGo) + 'px';
        },
        callback:function(){currentImage = imageToGo;}
    };
    animate(opts);
}

function onClickPrev(){
    if (currentImage == 0){
        slideTo(imageNumber - 1);
    }
    else{
        slideTo(currentImage - 1);
    }
}

function onClickNext(){
    if (currentImage == imageNumber - 1){
        slideTo(0);
    }
    else{
        slideTo(currentImage + 1);
    }
}

function generatePager(imageNumber){
    let pageNumber;
    let pagerDiv = document.getElementById('pager');
    for (let i = 0; i < imageNumber; i++){
        var li = document.createElement('li');
        pageNumber = document.createTextNode(parseInt(i + 1));
        li.appendChild(pageNumber);
        pagerDiv.appendChild(li);
        li.onclick = function(i){
            return function(){
                slideTo(i);
            }
        }(i);
    }
    let computedStyle = document.defaultView.getComputedStyle(li, null);
    let liWidth = parseInt(li.offsetWidth);
    let liMargin = parseInt(computedStyle.margin.replace('px',""));
    pagerDiv.style.width = parseInt((liWidth + liMargin * 2) * imageNumber) + 'px';
}
window.onload = init;
