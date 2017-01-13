'use strict';

let ul,
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
    imageWidth = liItems[0].clientWidth;
    prev = document.querySelector(".prev");
    next = document.querySelector(".next");
    generatePager(imageNumber);
    prev.onclick = function(){ onClickPrev();};
    next.onclick = function(){ onClickNext();};
}

function animate(opts){
    let start = new Date,
        id = setInterval(function(){

            let timePassed = new Date - start,
                progress = timePassed / opts.duration;

            if (progress > 1){
                progress = 1;
            }

            let delta = opts.delta(progress);
            opts.step(delta);

            if (progress == 1){
                clearInterval(id);
                opts.callback();
            }
    });
}

function slideTo(imageToGo){
    let numOfImageToGo = Math.abs(imageToGo - currentImage),
        direction;

    direction = currentImage > imageToGo ? 1 : -1;
    currentPostion = -1 * currentImage * imageWidth ;

    let opts = {
        duration: 1000,
        delta:(p) => p,
        step:(delta) => {
            if(direction == 1) {
                ul.style.left = parseInt(currentPostion + (delta * ((imageWidth) * numOfImageToGo))) + 'px';
            } else {
                ul.style.left = parseInt(currentPostion - (delta * ((imageWidth+(currentImage+1)*25)) * numOfImageToGo)) + 'px';
            }
        },
        callback:() => {currentImage = imageToGo;}
    };
    animate(opts);
}

function onClickPrev(){
    if (!currentImage){
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
    let pagerDiv = document.getElementById('pager'),
        pageNumber;

    for (let i = 0; i < imageNumber; i++){
        const li = document.createElement('li');
        pageNumber = document.createTextNode(parseInt(i + 1));
        li.appendChild(pageNumber);
        pagerDiv.appendChild(li);
        li.onclick = function(i){
            return function(){
                slideTo(i);
            }
        }(i);
    }
    let computedStyle = document.defaultView.getComputedStyle(li, null),
        liWidth = parseInt(li.offsetWidth),
        liMargin = parseInt(computedStyle.margin.replace('px',""));

    pagerDiv.style.width = parseInt((liWidth + liMargin * 2) * imageNumber) + 'px';
}
window.onload = init;

//scroll to

const navSpans = [].slice.call(document.querySelectorAll('.main-list-item a'));
navSpans.filter(function(n) {
    n.addEventListener('click', jumpTo, true);
});

function jumpTo(e) {
    e.preventDefault();
    scroll.To(e.target.dataset.id);
}

/* scroll to target */
const scroll = ( () => {

    let elementPosition = (a) => () => a.getBoundingClientRect().top;

    let scrolling = ( elementID ) => {

        let el = document.getElementById( elementID ),
            elPos = elementPosition( el ),
            duration = 600,
            increment = Math.round( Math.abs( elPos() )/50 ),
            time = Math.round( duration/increment ),
            last = 0,
            E;

        function scroller() {
            E = elPos();

            if (E === last) {
                return;
            } else {
                last = E;
            }

            increment = (E > -20 && E < 20) ? ((E > - 5 && E < 5) ? 1 : 5) : increment;

            if (E > 1 || E < -1) {

                if (E < 0) {
                    window.scrollBy( 0,-increment );
                } else {
                    window.scrollBy( 0,increment );
                }

                setTimeout(scroller, time);

            }
        }

        scroller();
    };

    return {
        To: scrolling
    }

})();