import Hls from "hls.js";

const hlsVideoEls = document.querySelectorAll('.hls-video');

const options = {
    rootMargin: '0px',  // top, right, bottom, left margins around the root
    threshold: 0.2
};

const intersectionCallback = (entries) => {
    entries.forEach((entry) => {
        
        let elem = entry.target;

        if (!elem) return;

        if (!elem.classList) return;

        if (!elem.classList.contains('hls-video')) return;
        
        const hlsVideo = elem;

        if (entry.isIntersecting) {
        
            if (!hlsVideo) return;
       
            hlsInitPlay(hlsVideo);

        } else {
            hlsVideo.pause();
        }
    });
};
  
  
const observer = new IntersectionObserver(intersectionCallback, options);

function hlsInitPlay(video) {

    if (video.classList.contains('hls-initialized')) {
        video.play();
        return;
    }

    let hlsSrc = video.dataset.streamableSrc;
    const stdSrc = video.dataset.standardSrc;
    
    if (hlsSrc.includes('www.goodlookers.co.uk/cdn/shop')) {
        hlsSrc = hlsSrc.replace('www.goodlookers.co.uk/cdn/shop', 'cdn.shopify.com');
    }

    if(Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(hlsSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
            video.play();
        });
    } else {
        video.src = stdSrc;
        video.addEventListener('canplay',function() {
            video.play();
        });
    }

    video.classList.add('hls-initialized');
}

const hlsVideos = document.querySelectorAll('.hls-video');

for (const video of hlsVideos) {
    observer.observe(video);
}