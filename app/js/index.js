'use strict';

window.addEventListener('load', function() {
    let newsWrapper,
        divItems,
        imageNumber,
        imageWidth,
        prev,
        next;
    let currentPosition = 0;
    let currentImage = 0;

    function init() {
        newsWrapper = document.getElementById('image_slider');
        divItems = newsWrapper.children;
        imageNumber = divItems.length;
        imageWidth = divItems[0].offsetWidth;
        newsWrapper.style.width = `${parseInt(imageWidth * imageNumber)}px`;
        prev = document.querySelector(".prev");
        next = document.querySelector(".next");
        generateDots(imageNumber);
        prev.onclick = () => {
            onClickPrev();
        };
        next.onclick = () => {
            onClickNext();
        };
    }
    function animate(opts) {
        let start = new Date,
            id = setInterval(() => {
                let timePassed = new Date - start,
                    progress = timePassed / opts.duration;

                if (progress > 1) {
                    progress = 1;
                }
                let delta = opts.delta(progress);
                opts.step(delta);

                if (progress == 1) {
                    clearInterval(id);
                    opts.callback();
                }
        }, opts.delay || 17);
    }

    function slideTo(imageToGo) {
        let direction,
            numOfImageToGo = Math.abs(imageToGo - currentImage);

        direction = currentImage > imageToGo ? 1 : -1;
        currentPosition = -1 * currentImage * imageWidth;

        let opts = {
            duration: 500,
            delta(p) {
                return p;
            },
            step(delta) {
                newsWrapper.style.left = `${parseInt(currentPosition + direction * delta * imageWidth * numOfImageToGo)}px`;
            },
            callback() {
                currentImage = imageToGo;
            }
        };
        animate(opts);
    }
    function activeDot(q) {
        let remLi = document.getElementsByClassName('dot');

        for(let j = 0; j < imageNumber/3; j++){
            remLi[j].classList.remove('active');
        }
        remLi[q].classList.add('active');
    }
    function onClickNext() {
        if (currentImage == imageNumber - 3) {
            slideTo(0);
            activeDot(0);
        }
        else {
            slideTo(currentImage + 3);
            activeDot((currentImage + 3)/3);
        }
    }

    function onClickPrev() {
        if (currentImage == 0) {
            slideTo(imageNumber - 3);
            activeDot((imageNumber - 3)/3);
        }
        else {
            slideTo(currentImage - 3);
            activeDot((currentImage - 3)/3);
        }
    }

    function generateDots(imageNumber) {
        let i,
            pagerDiv = document.getElementById('pager');

        for (i = 0; i < imageNumber; i = i + 3) {
            let li = document.createElement('li');
            li.className = "dot";
            pagerDiv.appendChild(li);
            li.onclick = (i => function () {
                slideTo(i);
                let remLi = document.getElementsByClassName('dot');
                for(let j = 0; j < imageNumber/3; j++){
                    remLi[j].classList.remove('active');
                }
                this.classList.add('active');
            })(i);
        }
        pagerDiv.firstElementChild.classList.add('active');
    }
    init();
});

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